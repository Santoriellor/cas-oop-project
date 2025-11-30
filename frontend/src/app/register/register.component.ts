import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-register',
  template: `
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="bg-white shadow-lg rounded-xl p-8">
        <h2 class="text-2xl font-semibold text-gray-800 text-center mb-6">Create your account</h2>

        <div class="space-y-4">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="email">Email</label>
            <div class="relative">
              <input id="email" [(ngModel)]="email" (ngModelChange)="onEmailChange($event)" type="email" autocomplete="email"
                     class="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm pr-20 p-2"
                     placeholder="you@example.com" />
              <span *ngIf="email && checkingEmail" class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">Checking…</span>
              <span *ngIf="email && !checkingEmail && emailAvailable === true" class="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">Available</span>
              <span *ngIf="email && !checkingEmail && emailAvailable === false" class="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">Taken</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">We'll never share your email.</p>
          </div>

          <!-- Username -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="username">Username</label>
            <div class="relative">
              <input id="username" [(ngModel)]="username" (ngModelChange)="onUsernameChange($event)" type="text" autocomplete="username"
                     class="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm pr-20 p-2"
                     placeholder="yourname" />
              <span *ngIf="username && checkingUsername" class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">Checking…</span>
              <span *ngIf="username && !checkingUsername && usernameAvailable === true" class="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">Available</span>
              <span *ngIf="username && !checkingUsername && usernameAvailable === false" class="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">Taken</span>
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="password">Password</label>
            <input id="password" [(ngModel)]="password" type="password" autocomplete="new-password"
                   class="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm p-2"
                   placeholder="••••••••" />
            <p class="text-xs text-gray-500 mt-1">Use at least 8 characters.</p>
          </div>

          <button (click)="register()" [disabled]="!canSubmit()"
                  class="w-full inline-flex justify-center items-center rounded-lg py-2.5 font-medium transition
                         text-white bg-indigo-600 enabled:hover:bg-indigo-700 enabled:focus:outline-none enabled:focus:ring-2 enabled:focus:ring-indigo-500 enabled:focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed">
            Create account
          </button>

          <div *ngIf="message" class="rounded-md bg-blue-50 border border-blue-200 p-3">
            <p class="text-sm text-blue-700">{{message}}</p>
          </div>
        </div>
      </div>

      <p class="text-center text-sm text-gray-600 mt-4">
        Already have an account?
        <a routerLink="/login" class="text-indigo-600 hover:text-indigo-500 font-medium">Login</a>
      </p>
    </div>
  </div>
  `
})
export class RegisterComponent {
  email = '';
  username = '';
  password = '';
  message: string | null = null;
  emailAvailable: boolean | null = null;
  usernameAvailable: boolean | null = null;
  checkingEmail = false;
  checkingUsername = false;
  private emailDebounce?: any;
  private usernameDebounce?: any;

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.auth.register(this.email, this.username, this.password).subscribe({
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
    return !!this.email && !!this.username && !!this.password && this.emailAvailable === true && this.usernameAvailable === true;
  }
}
