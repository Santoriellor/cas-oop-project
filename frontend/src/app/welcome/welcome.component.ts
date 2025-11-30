import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-welcome',
  template: `
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="w-full max-w-3xl">
      <div class="bg-white shadow-lg rounded-2xl overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
          <h2 class="text-2xl font-semibold">Welcome</h2>
          <p class="text-indigo-100" *ngIf="user; else neutralGreeting">Glad to see you back, {{ user.username }}.</p>
          <ng-template #neutralGreeting>
            <p class="text-indigo-100" *ngIf="loading">Loading your profile…</p>
          </ng-template>
        </div>

        <!-- Content when user is available -->
        <div class="p-6" *ngIf="user; else loadingBlock">
          <div class="flex items-center gap-4">
            <div class="flex-shrink-0 h-16 w-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-semibold">
              {{ getInitials() }}
            </div>
            <div class="flex-1">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div>
                  <p class="text-lg font-semibold text-gray-900">{{ user.username }}</p>
                  <p class="text-sm text-gray-600">{{ user.email }}</p>
                </div>
                <div class="mt-2 sm:mt-0" *ngIf="user">
                  <button (click)="logout()"
                          class="inline-flex items-center rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6" *ngIf="user?.roles?.length">
            <h3 class="text-sm font-medium text-gray-700 mb-2">Roles</h3>
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let r of user.roles"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                {{ formatRole(r) }}
              </span>
            </div>
          </div>

          <div class="mt-6 text-sm text-gray-600">
            <p *ngIf="user?.createdAt">Member since: <span class="font-medium text-gray-800">{{ user.createdAt | date:'medium' }}</span></p>
            <p *ngIf="user?.lastLogin" class="mt-1">Last login: <span class="font-medium text-gray-800">{{ user.lastLogin | date:'medium' }}</span></p>
          </div>
        </div>

        <!-- Loading/placeholder block when user is null (initial load) -->
        <ng-template #loadingBlock>
          <div class="p-6" *ngIf="loading">
            <div class="animate-pulse">
              <div class="flex items-center gap-4">
                <div class="h-16 w-16 rounded-full bg-indigo-200"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
              <div class="mt-6 space-y-3">
                <div class="h-3 bg-gray-200 rounded w-24"></div>
                <div class="flex gap-2">
                  <div class="h-6 w-16 bg-gray-200 rounded-full"></div>
                  <div class="h-6 w-20 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </ng-template>
      </div>
    </div>
  </div>
  `
})
export class WelcomeComponent implements OnInit {
  user: { username: string; email: string; roles: string[]; createdAt?: string; lastLogin?: string } | null = null;
  loading = true;

  constructor(private readonly auth: AuthService, private readonly http: HttpClient) {}

  ngOnInit(): void {
    const token = this.auth.getToken();
    if (!token) {
      this.logout();
      return;
    }

    this.auth.me()
      .subscribe({
        next: (u) => {
          this.user = {
            username: u.username,
            email: u.email,
            roles: Array.isArray(u.roles) ? u.roles : [],
            createdAt: u.createdAt,
            lastLogin: u.lastLogin
          };
          this.loading = false;
        },
        error: () => {
          // Already handled 401 in AuthService
          this.loading = false;
          console.error('Unable to fetch user profile');
          this.logout();
        }
      });
  }

  logout() {
    this.auth.logout();
    window.location.href = '/login';
  }

  getInitials(): string {
    if (!this.user) return '';
    const src = this.user.username || this.user.email || '';
    const parts = src.split(/\s+|\.|_|-/).filter(Boolean);
    const initials = (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
    return initials.toUpperCase() || (this.user.email?.[0] || '').toUpperCase();
  }

  formatRole(r: string): string {
    if (!r) return '';
    return r.replace(/^ROLE_/,'').replace(/_/g,' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
}
