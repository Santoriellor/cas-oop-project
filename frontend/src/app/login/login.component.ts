import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

/**
 * Login component.
 *
 * <p>
 * This component provides the user interface and logic for
 * authenticating a user using email and password credentials.
 * </p>
 *
 * <p>
 * On successful authentication, the received token is stored
 * and the user is redirected to the welcome page.
 * </p>
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  /**
   * Email address entered by the user.
   */
  email = '';

  /**
   * Password entered by the user.
   */
  password = '';

  /**
   * Error message displayed when login fails.
   */
  error: string | null = null;

  /**
   * Creates a new {@link LoginComponent}.
   *
   * @param auth service responsible for authentication
   * @param router Angular router used for navigation
   */
  constructor(private auth: AuthService, private router: Router) {}

  /**
   * Attempts to authenticate the user with the provided credentials.
   *
   * <p>
   * On success, the authentication token is stored and the user
   * is redirected to the welcome page.
   * </p>
   *
   * <p>
   * On failure, an error message is extracted from the response
   * and displayed to the user.
   * </p>
   */
  login() {
    this.auth.login(this.email, this.password).subscribe({
      next: (res: any) => {
        // Store authentication token
        this.auth.saveToken(res.token);
        // Redirect to welcome page after successful login
        this.router.navigate(['/welcome']);
      },
      error: (err) => {
        // Extract and display error message from backend response
        this.error = err?.error?.error || 'Erreur';
      }
    });
  }
}
