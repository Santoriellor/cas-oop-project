import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { HttpClient } from '@angular/common/http';

/**
 * Welcome component.
 *
 * <p>
 * This component serves as the landing page after a successful login.
 * It loads and displays basic profile information of the authenticated user.
 * </p>
 */
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  /**
   * Currently authenticated user profile.
   *
   * <p>
   * Contains basic identity and role information retrieved
   * from the backend.
   * </p>
   */
  user: { username: string; email: string; roles: string[]; createdAt?: string; lastLogin?: string } | null = null;

  /**
   * Indicates whether the user profile is currently being loaded.
   */
  loading = true;

  /**
   * Creates a new {@link WelcomeComponent}.
   *
   * @param auth service used to retrieve authentication and user profile data
   * @param http injected HTTP client (reserved for future extensions)
   */
  constructor(private readonly auth: AuthService, private readonly http: HttpClient) {}

  /**
   * Angular lifecycle hook invoked after component initialization.
   *
   * <p>
   * Validates the presence of a JWT token and loads
   * the authenticated user's profile.
   * </p>
   */
  ngOnInit(): void {
    const token = this.auth.getToken();

    // Redirect to login if no token is present
    if (!token) {
      this.logout();
      return;
    }

    // Load current user profile
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
          // 401 errors are already handled in AuthService
          this.loading = false;
          console.error('Unable to fetch user profile');
          this.logout();
        }
      });
  }

  /**
   * Logs the user out and redirects to the login page.
   */
  logout() {
    this.auth.logout();
    window.location.href = '/login';
  }

  /**
   * Generates initials based on the username or email address.
   *
   * <p>
   * Used for avatar placeholders or compact user indicators.
   * </p>
   *
   * @returns uppercase initials derived from username or email
   */
  getInitials(): string {
    if (!this.user) return '';
    const src = this.user.username || this.user.email || '';
    const parts = src.split(/\s+|\.|_|-/).filter(Boolean);
    const initials = (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
    return initials.toUpperCase() || (this.user.email?.[0] || '').toUpperCase();
  }

  /**
   * Formats a backend role string into a human-readable label.
   *
   * <p>
   * Example:
   * <code>ROLE_ADMIN</code> → <code>Admin</code>
   * </p>
   *
   * @param r raw role string
   * @returns formatted role label
   */
  formatRole(r: string): string {
    if (!r) return '';
    return r.replace(/^ROLE_/,'').replace(/_/g,' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
}
