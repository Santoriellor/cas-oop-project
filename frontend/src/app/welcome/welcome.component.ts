import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-welcome',
  template: `
    <div class="bg-white shadow rounded p-6 max-w-3xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">Welcome!</h2>
      <p *ngIf="user">Glad to see you back, {{ user.username }}.</p>
      <p *ngIf="!user && loading">Loading your profile…</p>
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
