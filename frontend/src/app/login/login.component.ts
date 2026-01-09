import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <header class="topbar topbar--auth">
      <div class="topbar__inner" style="justify-content:center;">
        <a class="brand" routerLink="/login">
          <img class="brand__logo brand__logo--auth" src="/assets/logo.png" alt="ReTrainEd">
        </a>
      </div>
     </header>
  <div class="auth-page">
    <div class="auth-shell">

      <section class="auth-hero">
        <h1 class="auth-hero__title">CAS Fortbildungen</h1>
        <p class="auth-hero__text">
          Moderne Schulung für Physiotherapeut:innen - Kurse buchen, Unterlagen laden, Zertifikate erhalten.
         </p>
        </section>

        <section class="card card--padded auth-card">
          <div class="row" style="justify-content: space-between;">
            <h2 class="auth-card__title">Anmelden</h2>

            <div class="net-pill">
              <app-connection-status></app-connection-status>
             </div>
            </div>

            <form class="stack" (ngSubmit)="login()">
              <div class="field">
                <label class="label" for="email">E-Mail</label>
                <input
                  id="email"
                  class="input"
                  [(ngModel)]="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  placeholder="you@example.com"
                  required
                 />
                </div>

                <div class="field">
                  <label class="label" for="password">Passwort</label>
                  <input
                    id="password"
                    class="input"
                    [(ngModel)]="password"
                    name="password"
                    type="password"
                    autocomplete="current-password"
                    placeholder="••••••••"
                    required
                   />
                  </div>

                  <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center;">
                    Login
                    </button>

                    <div *ngIf="error" class="alert alert--danger">
                      {{ error }}
                     </div>
                    </form>

                    <p class="subtle" style="margin: 14px 0 0 0 ; font-size: 14px;">
                      Noch kein Konto?
                      <a routerLink="/register" class="link">Registrieren</a>
                     </p>
                    </section>

                   </div>
                 </div>
             `
})
export class LoginComponent {
  email = '';
  password = '';
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.email, this.password).subscribe({
      next: (res: any) => {
        this.auth.saveToken(res.token);
        this.router.navigate(['/welcome']);
      },
      error: (err) => {
        this.error = err?.error?.error || 'Erreur';
      }
    });
  }
}
