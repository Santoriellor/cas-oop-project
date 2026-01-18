import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

/**
 * Registration component.
 *
 * <p>
 * This component handles user sign-up by collecting credentials and role selection.
 * It also performs client-side validation and availability checks for:
 * </p>
 *
 * <ul>
 *   <li>Email address</li>
 *   <li>Username</li>
 *   <li>Password strength</li>
 * </ul>
 *
 * <p>
 * Availability checks are debounced to reduce the number of backend requests
 * while the user is typing.
 * </p>
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  /**
   * Email address entered by the user.
   */
  email = '';

  /**
   * Username entered by the user.
   */
  username = '';

  /**
   * Password entered by the user.
   */
  password = '';

  /**
   * Flag indicating whether the user role is selected.
   */
  isUser = true;

  /**
   * Flag indicating whether the admin role is selected.
   */
  isAdmin = false;

  /**
   * Message shown to the user (success or error feedback).
   */
  message: string | null = null;

  /**
   * Email availability status:
   * <ul>
   *   <li>{@code true} = available</li>
   *   <li>{@code false} = already taken</li>
   *   <li>{@code null} = unknown / not checked yet</li>
   * </ul>
   */
  emailAvailable: boolean | null = null;

  /**
   * Username availability status:
   * <ul>
   *   <li>{@code true} = available</li>
   *   <li>{@code false} = already taken</li>
   *   <li>{@code null} = unknown / not checked yet</li>
   * </ul>
   */
  usernameAvailable: boolean | null = null;

  /**
   * Indicates that an email availability check is currently running.
   */
  checkingEmail = false;

  /**
   * Indicates that a username availability check is currently running.
   */
  checkingUsername = false;

  /**
   * Timer reference used to debounce email availability requests.
   */
  private emailDebounce?: any;

  /**
   * Timer reference used to debounce username availability requests.
   */
  private usernameDebounce?: any;

  /**
   * Creates a new {@link RegisterComponent}.
   *
   * @param auth service used for registration and availability checks
   * @param router Angular router used for navigation
   */
  constructor(private auth: AuthService, private router: Router) {}

  /**
   * Submits the registration request to the backend.
   *
   * <p>
   * On success, a success message is shown and the user is redirected
   * to the login page after a short delay.
   * </p>
   *
   * <p>
   * On failure, an error message is extracted from the response and displayed.
   * </p>
   */
  register() {
    console.log('REGISTER Clicked');
    this.auth.register(this.email, this.username, this.password, this.isUser, this.isAdmin).subscribe({
      next: () => {
        // Show success message and redirect to login
        this.message = 'Inscription réussie. Vous pouvez vous connecter.';
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: (err) => {
        // Show backend error message if available
        this.message = err?.error?.error || 'Erreur lors de l\'inscription';
      }
    });
  }

  /**
   * Handles email input changes and triggers a debounced availability check.
   *
   * @param value the new email value
   */
  onEmailChange(value: string) {
    this.email = value;
    this.emailAvailable = null;

    // Cancel any pending debounce timer
    if (this.emailDebounce) clearTimeout(this.emailDebounce);

    // If input is empty, stop checking
    if (!value) { this.checkingEmail = false; return; }
    this.checkingEmail = true;

    // Debounce backend requests to reduce load while typing
    this.emailDebounce = setTimeout(() => {
      this.auth.checkEmailAvailable(value).subscribe({
        next: res => { this.emailAvailable = res.available; this.checkingEmail = false; },
        error: () => { this.emailAvailable = null; this.checkingEmail = false; }
      });
    }, 300);
  }

  /**
   * Handles username input changes and triggers a debounced availability check.
   *
   * @param value the new username value
   */
  onUsernameChange(value: string) {
    this.username = value;
    this.usernameAvailable = null;

    // Cancel any pending debounce timer
    if (this.usernameDebounce) clearTimeout(this.usernameDebounce);

    // If input is empty, stop checking
    if (!value) { this.checkingUsername = false; return; }
    this.checkingUsername = true;

    // Debounce backend requests to reduce load while typing
    this.usernameDebounce = setTimeout(() => {
      this.auth.checkUsernameAvailable(value).subscribe({
        next: res => { this.usernameAvailable = res.available; this.checkingUsername = false; },
        error: () => { this.usernameAvailable = null; this.checkingUsername = false; }
      });
    }, 300);
  }

  /**
   * Determines whether the form can be submitted.
   *
   * <p>
   * The form is considered valid if:
   * </p>
   * <ul>
   *   <li>Email, username, and password are provided</li>
   *   <li>Email and username are available</li>
   *   <li>At least one role is selected</li>
   *   <li>Password strength score meets the minimum threshold</li>
   * </ul>
   *
   * @return {@code true} if submission is allowed, otherwise {@code false}
   */
  canSubmit(): boolean {
    return !!this.email && !!this.username && !!this.password && this.emailAvailable === true && this.usernameAvailable === true && (this.isUser || this.isAdmin) && this.passwordScore >= 3;
  }

  /**
   * Computes the password strength score (0-5).
   *
   * <p>
   * Scoring criteria:
   * </p>
   * <ul>
   *   <li>Length >= 8</li>
   *   <li>Length >= 12</li>
   *   <li>Contains uppercase letter</li>
   *   <li>Contains digit</li>
   *   <li>Contains special character</li>
   * </ul>
   *
   * @return a score from 0 (weak) to 5 (strong)
   */
  get passwordScore(): number
  {
    const p = this.password || '';
    let score = 0;

    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;

    // Score 0-5
    return score;
  }

  /**
   * Returns a human-readable password strength label based on {@link #passwordScore}.
   *
   * @return "-", "Schwach", "Mittel", or "Stark"
   */
  get passwordStrengthLabel(): string {
    const s = this.passwordScore;
    if (!this.password) return '-';
    if (s <= 2) return 'Schwach';
    if (s <= 4) return 'Mittel';
    return 'Stark';
  }

  /**
   * Returns a CSS class name representing password strength.
   *
   * <p>
   * This can be used for custom styling of a strength meter.
   * </p>
   *
   * @return a CSS class name for the current strength level
   */
  get passwordStrengthClass(): string {
    const s = this.passwordScore;
    if (!this.password) return 'meter--empty';
    if (s <= 2) return 'meter--weak';
    if (s <= 4) return 'meter--medium';
    return 'meter--strong';
  }
}



