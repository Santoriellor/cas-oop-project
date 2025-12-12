import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) { }

  register(email: string, username: string, password: string): Observable<any> {
    return this.http.post(`${this.api}/auth/register`, { email, username, password });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.api}/auth/login`, { email, password });
  }

  me(): Observable<any> {
    // Include JWT in Authorization header
    return this.http.get(`${this.api}/users/me`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(err => {
          if (err.status === 401) {
            this.logout();
            window.location.href = '/login';
          }
        throw err;
      })
    );
  }

  checkEmailAvailable(email: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(`${this.api}/auth/available/email`, { params: { value: email } });
  }

  checkUsernameAvailable(username: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(`${this.api}/auth/available/username`, { params: { value: username } });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders({ Authorization: `Bearer ${token}` });
    }
    return new HttpHeaders();
  }
}
