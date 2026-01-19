import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

/**
 * Route guard for protecting authenticated routes.
 *
 * <p>
 * This guard prevents access to routes that require authentication.
 * It checks whether a valid authentication token is present and
 * redirects unauthenticated users to the login page.
 * </p>
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  /**
   * Creates a new {@link AuthGuard}.
   *
   * @param auth service used to access authentication state
   * @param router Angular router used for navigation
   */
  constructor(private auth: AuthService, private router: Router) {}

  /**
   * Determines whether a route can be activated.
   *
   * <p>
   * If no authentication token is found, the user is redirected
   * to the login page and access is denied.
   * </p>
   *
   * @return {@code true} if the route can be activated, otherwise {@code false}
   */
  canActivate(): boolean {
    const token = this.auth.getToken();
    // Redirect unauthenticated users to the login page
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
