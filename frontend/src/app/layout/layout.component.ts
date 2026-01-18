import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';

/**
 * Main application layout component.
 *
 * <p>
 * This component defines the overall page layout, including:
 * </p>
 *
 * <ul>
 *   <li>Top navigation bar</li>
 *   <li>Responsive sidebar navigation</li>
 *   <li>User role-based menu visibility</li>
 *   <li>Logout functionality</li>
 * </ul>
 *
 * <p>
 * The component retrieves the currently authenticated user
 * and uses role information to control navigation options.
 * </p>
 */
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  /**
   * Indicates whether the sidebar is currently open (mobile view).
   */
  sidebarOpen = false;

  /**
   * Currently authenticated user.
   *
   * <p>
   * Contains user profile and role information retrieved
   * from the backend.
   * </p>
   */
  user: any = null;

  /**
   * Creates a new {@link LayoutComponent}.
   *
   * @param auth service used to retrieve user information and handle logout
   */
  constructor(private auth: AuthService) {
    this.auth.me().subscribe(u => this.user = u);
  }

  /**
   * Toggles the visibility of the sidebar.
   *
   * <p>
   * Used primarily for mobile navigation.
   * </p>
   */
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  /**
   * Logs the user out of the application.
   *
   * <p>
   * Clears authentication data and redirects the user
   * to the login page.
   * </p>
   */
  logout() {
    this.auth.logout();
    window.location.href = '/login';
  }

  /**
   * Checks whether the current user has the ADMIN role.
   *
   * @return {@code true} if the user is an administrator
   */
  isAdmin(): boolean {
    return this.user && this.user.roles && this.user.roles.includes('ROLE_ADMIN');
  }

  /**
   * Checks whether the current user has the USER role.
   *
   * @return {@code true} if the user is a standard user
   */
  isUser(): boolean {
    return this.user && this.user.roles && this.user.roles.includes('ROLE_USER');
  }
}
