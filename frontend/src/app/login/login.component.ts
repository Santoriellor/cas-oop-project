import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  template: `
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="bg-white shadow-lg rounded-xl p-8">
        <h2 class="text-2xl font-semibold text-gray-800 text-center mb-6">Sign in to your account</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" for="email">Email</label>
            <input id="email" [(ngModel)]="email" type="email" autocomplete="email"
                   class="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm p-2"
                   placeholder="you@example.com" />
          </div>
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-sm font-medium text-gray-700" for="password">Password</label>
            </div>
            <input id="password" [(ngModel)]="password" type="password" autocomplete="current-password"
                   class="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm p-2"
                   placeholder="••••••••" />
          </div>

          <button (click)="login()"
                  class="w-full inline-flex justify-center items-center rounded-lg bg-indigo-600 text-white py-2.5 font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition">
            Login
          </button>

          <div *ngIf="error" class="rounded-md bg-red-50 border border-red-200 p-3">
            <p class="text-sm text-red-700">{{error}}</p>
          </div>
        </div>
      </div>
      <p class="text-center text-sm text-gray-600 mt-4">
        Don't have an account?
        <a routerLink="/register" class="text-indigo-600 hover:text-indigo-500 font-medium">Register</a>
      </p>
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
