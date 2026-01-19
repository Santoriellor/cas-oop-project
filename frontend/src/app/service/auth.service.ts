import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {environment} from "../../environments/environment";

/**
 * Authentication service.
 *
 * <p>
 * This service provides methods for:
 * </p>
 *
 * <ul>
 *   <li>User registration</li>
 *   <li>User login</li>
 *   <li>Retrieving the authenticated user's profile</li>
 *   <li>Checking availability of email and username</li>
 *   <li>Token storage and retrieval</li>
 * </ul>
 *
 * <p>
 * The base API URL is taken from the Angular environment configuration.
 * </p>
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

  /**
   * Base URL for backend API calls (configured via environment).
   */
  private api = environment.apiUrl;

  /**
   * Creates a new {@link AuthService}.
   *
   * @param http Angular HTTP client used to call backend endpoints
   */
  constructor(private http: HttpClient) { }

  /**
   * Registers a new user account.
   *
   * @param email user's email address
   * @param username desired username
   * @param password user's password (sent to backend, typically hashed server-side)
   * @param isUser whether the USER role should be assigned
   * @param isAdmin whether the ADMIN role should be assigned
   * @return an observable of the backend response (typically containing a token)
   */
  register(email: string, username: string, password: string, isUser: boolean, isAdmin: boolean): Observable<any> {
    return this.http.post(`${this.api}/auth/register`, { email, username, password, isUser, isAdmin });
  }

  /**
   * Logs a user in using email and password credentials.
   *
   * @param email user's email address
   * @param password user's password
   * @return an observable of the backend response (typically containing a token)
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.api}/auth/login`, { email, password });
  }

  /**
   * Retrieves the currently authenticated user's profile.
   *
   * <p>
   * The request includes the JWT in the Authorization header.
   * If the backend responds with 401 (unauthorized), the user is logged out
   * and redirected to the login page.
   * </p>
   *
   * @return an observable containing the user's profile information
   */
  me(): Observable<any> {
    // Include JWT in Authorization header
    return this.http.get(`${this.api}/users/me`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(err => {
          // If the token is invalid/expired, force logout and redirect to login
          if (err.status === 401) {
            this.logout();
            window.location.href = '/login';
          }
        throw err;
      })
    );
  }

  /**
   * Checks whether an email address is available for registration.
   *
   * @param email email address to check
   * @return an observable containing an availability flag
   */
  checkEmailAvailable(email: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(`${this.api}/auth/available/email`, { params: { value: email } });
  }

  /**
   * Checks whether a username is available for registration.
   *
   * @param username username to check
   * @return an observable containing an availability flag
   */
  checkUsernameAvailable(username: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(`${this.api}/auth/available/username`, { params: { value: username } });
  }

  /**
   * Stores the JWT token locally.
   *
   * @param token JWT token returned by the backend
   */
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  /**
   * Retrieves the stored JWT token, if present.
   *
   * @return the token or {@code null} if not found
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Logs the user out by removing the stored token.
   */
  logout() {
    localStorage.removeItem('token');
  }

  /**
   * Builds HTTP headers containing the Authorization Bearer token (if available).
   *
   * @return {@link HttpHeaders} with Authorization header, or empty headers if no token exists
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders({ Authorization: `Bearer ${token}` });
    }
    return new HttpHeaders();
  }
}
