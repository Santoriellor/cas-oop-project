import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <header class="topbar topbar--auth">
      <div class="topbar__inner" style="justify-content: center;">
        <a class="brand" routerLink="/login" aria-label="Zur Startseite">
          <img class="brand__logo brand__logo--auth" src="/assets/logo.png" alt="ReTrainEd">
        </a>
      </div>
    </header>

    <div class="auth-page">
      <div class="auth-shell">

        <section class="auth-hero">
          <h1 class="auth-hero__title">CAS Fortbildung</h1>
          <p class="auth-hero__text">
            Konto erstellen und direkt Kurse buchen, Unterlagen laden und Zertifikate erhalten.
          </p>
        </section>

        <section class="card card--padded auth-card">
          <div class="row" style="justify-content: space-between;">
            <h2 class="auth-card__title">Registrieren</h2>

            <div class="net-pill">
              <app-connection-status></app-connection-status>
            </div>
          </div>

          <form class="stack" (ngSubmit)="register()">

            <!-- Email -->
            <div class="field">
              <label class="label" for="email">E-Mail</label>

              <div class="input-wrap">
                <input
                  id="email"
                  class="input"
                  [(ngModel)]="email"
                  name="email"
                  (ngModelChange)="onEmailChange($event)"
                  type="email"
                  autocomplete="email"
                  placeholder="you@example.com"
                  required
                  [class.input--ok]="email && !checkingEmail && emailAvailable === true"
                  [class.input--bad]="email && !checkingEmail && emailAvailable === false"
                />

                <span *ngIf="email && checkingEmail" class="input-suffix subtle">Prüfe...</span>
                <span *ngIf="email && !checkingEmail && emailAvailable === true" class="badge badge--open input-suffix">Frei</span>
                <span *ngIf="email && !checkingEmail && emailAvailable === false" class="badge badge--done input-suffix">Belegt</span>
              </div>

              <p class="subtle" style="margin:6px 0 0;">Wir teilen deine E-Mail nie mit Dritten.</p>
            </div>

            <!-- Username -->
            <div class="field">
              <label class="label" for="username">Benutzername</label>

              <div class="input-wrap">
                <input
                  id="username"
                  class="input"
                  [(ngModel)]="username"
                  name="username"
                  (ngModelChange)="onUsernameChange($event)"
                  type="text"
                  autocomplete="username"
                  placeholder="z.B. m.mueller"
                  required
                  [class.input--ok]="username && !checkingUsername && usernameAvailable === true"
                  [class.input--bad]="username && !checkingUsername && usernameAvailable === false"
                />


                <span *ngIf="username && checkingUsername" class="input-suffix subtle">Prüfe...</span>
                <span *ngIf="username && !checkingUsername && usernameAvailable === true" class="badge badge--open input-suffix">Frei</span>
                <span *ngIf="username && !checkingUsername && usernameAvailable === false" class="badge badge--done input-suffix">Belegt</span>
              </div>
            </div>

            <!-- Password -->
            <div class="field">
              <label class="label" for="password">Password</label>
              <input
                id="password"
                class="input"
                [(ngModel)]="password"
                name="password"
                type="password"
                autocomplete="new-password"
                placeholder="••••••••"
                required
              />
              <p class="subtle" style="margin:6px 0 0;">Mindestens 8 Zeichen empfohlen</p>
            </div>

            <div class="pw-meter">
              <div class="pw-meter__row">
                <span class="subtle">Passwortstärke</span>
                <strong class="pw-meter__label">{{ passwordStrengthLabel }}</strong>
              </div>

              <div class="pw-meter__bar" [ngClass]="passwordStrengthClass"
                    role="status" aria-live="polite">
                <span class="pw-meter__fill" [style.width.%]="(passwordScore / 5) * 100"></span>
              </div>

              <p class="subtle" style="margin:6px 0 0;">
                Tipp: 12+ Zeichen, Gross-/Kleinbuchstaben, Zahl & Sonderzeichen.
              </p>
            </div>

            <!-- Roles -->
            <div class="field">
              <label class="label">Registrieren als</label>

              <div class="row" style="gap:18px; flex-wrap:wrap">
                <label class="check">
                  <input type="checkbox" [(ngModel)]="isUser" name="isUser" />
                  <span>User</span>
                </label>

                <label class="check">
                  <input type="checkbox" [(ngModel)]="isAdmin" name="isAdmin" />
                  <span>Admin</span>
                </label>
              </div>

              <div *ngIf="!isUser && !isAdmin" class="alert alert--danger">
                Bitte mindestens eine Rolle auswählen.
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%; justify-content: center;"
                    [disabled]="!canSubmit()">
              Konto erstellen
            </button>

            <div *ngIf="message" class="alert" style="background: rgba(37,99,235,.08); border-color: rgba(37,99,235,.25); color:#1e3a8a;">
              {{ message }}
            </div>
          </form>

          <p class="subtle" style="margin: 14px 0 0 ; font-size: 14px;">
            Bereits ein Konto?
            <a routerLink="/login" class="link">Anmelden</a>
          </p>
        </section>
      </div>
    </div>
  `
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



