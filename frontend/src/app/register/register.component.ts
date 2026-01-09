import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email = '';
  username = '';
  password = '';
  isUser = true;
  isAdmin = false;
  message: string | null = null;
  emailAvailable: boolean | null = null;
  usernameAvailable: boolean | null = null;
  checkingEmail = false;
  checkingUsername = false;
  private emailDebounce?: any;
  private usernameDebounce?: any;

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    console.log('REGISTER Clicked');
    this.auth.register(this.email, this.username, this.password, this.isUser, this.isAdmin).subscribe({
      next: () => {
        this.message = 'Inscription réussie. Vous pouvez vous connecter.';
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: (err) => {
        this.message = err?.error?.error || 'Erreur lors de l\'inscription';
      }
    });
  }

  onEmailChange(value: string) {
    this.email = value;
    this.emailAvailable = null;
    if (this.emailDebounce) clearTimeout(this.emailDebounce);
    if (!value) { this.checkingEmail = false; return; }
    this.checkingEmail = true;
    this.emailDebounce = setTimeout(() => {
      this.auth.checkEmailAvailable(value).subscribe({
        next: res => { this.emailAvailable = res.available; this.checkingEmail = false; },
        error: () => { this.emailAvailable = null; this.checkingEmail = false; }
      });
    }, 300);
  }

  onUsernameChange(value: string) {
    this.username = value;
    this.usernameAvailable = null;
    if (this.usernameDebounce) clearTimeout(this.usernameDebounce);
    if (!value) { this.checkingUsername = false; return; }
    this.checkingUsername = true;
    this.usernameDebounce = setTimeout(() => {
      this.auth.checkUsernameAvailable(value).subscribe({
        next: res => { this.usernameAvailable = res.available; this.checkingUsername = false; },
        error: () => { this.usernameAvailable = null; this.checkingUsername = false; }
      });
    }, 300);
  }

  canSubmit(): boolean {
    return !!this.email && !!this.username && !!this.password && this.emailAvailable === true && this.usernameAvailable === true && (this.isUser || this.isAdmin) && this.passwordScore >= 3;
  }

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

  get passwordStrengthLabel(): string {
    const s = this.passwordScore;
    if (!this.password) return '-';
    if (s <= 2) return 'Schwach';
    if (s <= 4) return 'Mittel';
    return 'Stark';
  }

  get passwordStrengthClass(): string {
    const s = this.passwordScore;
    if (!this.password) return 'meter--empty';
    if (s <= 2) return 'meter--weak';
    if (s <= 4) return 'meter--medium';
    return 'meter--strong';
  }
}



