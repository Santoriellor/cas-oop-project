import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

/**
 * HTTP interceptor for attaching authentication tokens to outgoing requests.
 *
 * <p>
 * This interceptor automatically adds the {@code Authorization} header
 * with a Bearer token to all HTTP requests if a token is available.
 * </p>
 *
 * <p>
 * It ensures that authenticated API endpoints can be accessed
 * without manually adding headers in each service.
 * </p>
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  /**
   * Creates a new {@link AuthInterceptor}.
   *
   * @param auth service used to retrieve the authentication token
   */
  constructor(private auth: AuthService) {}

  /**
   * Intercepts outgoing HTTP requests.
   *
   * <p>
   * If an authentication token is present, the request is cloned
   * and the {@code Authorization} header is added.
   * </p>
   *
   * @param req the outgoing HTTP request
   * @param next the next interceptor or backend handler
   * @return an observable of the HTTP event stream
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();

    // Attach Authorization header if a token is available
    if (token) {
      const cloned = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
      return next.handle(cloned);
    }

    // Proceed without modification if no token exists
    return next.handle(req);
  }
}
