import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

/**
 * Unit tests for the {@link AuthService}.
 *
 * <p>
 * These tests verify the service's core responsibilities:
 * </p>
 *
 * <ul>
 *   <li>Login request behavior</li>
 *   <li>Registration request behavior</li>
 *   <li>Fetching current user profile</li>
 *   <li>Token cleanup during logout</li>
 * </ul>
 */
describe('AuthService', () => {

  /**
   * Service instance under test.
   */
  let service: AuthService;

  /**
   * HTTP mock controller used to assert outgoing requests
   * and provide mocked responses.
   */
  let httpMock: HttpTestingController;

  /**
   * Sets up the testing module and initializes dependencies before each test.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  /**
   * Ensures no outstanding HTTP requests remain and cleans storage after each test.
   */
  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  /**
   * Verifies that the service is created successfully.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Verifies login behavior:
   * <ul>
   *   <li>POST request is sent to the login endpoint</li>
   *   <li>Request body contains email and password</li>
   *   <li>Response token is returned to the caller</li>
   * </ul>
   */
  it('should login and save token', () => {
    const mockResponse = { token: 'mock-jwt-token' };
    const email = 'test@example.com';
    const password = 'password';

    service.login(email, password).subscribe(response => {
      expect(response.token).toBe('mock-jwt-token');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email, password });

    // Provide a mocked backend response
    req.flush(mockResponse);
  });

  /**
   * Verifies registration behavior:
   * <ul>
   *   <li>POST request is sent to the registration endpoint</li>
   *   <li>Request body contains credentials and role flags</li>
   *   <li>Response token is returned to the caller</li>
   * </ul>
   */
  it('should register successfully', () => {
    const mockResponse = { token: 'mock-jwt-token' };
    const email = 'test@example.com';
    const username = 'testuser';
    const password = 'password';

    service.register(email, username, password, true, false).subscribe(response => {
      expect(response.token).toBe('mock-jwt-token');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email, username, password, isUser: true, isAdmin: false });

    // Provide a mocked backend response
    req.flush(mockResponse);
  });

  /**
   * Verifies fetching of the current user profile.
   *
   * <p>
   * Ensures that the request includes the Authorization header if a token exists.
   * </p>
   */
  it('should get current user info', () => {
    const mockUser = { email: 'test@example.com', username: 'testuser' };
    localStorage.setItem('token', 'mock-token');

    service.me().subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/me`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');

    // Provide mocked user profile response
    req.flush(mockUser);
  });

  /**
   * Verifies logout behavior by ensuring the token is removed from storage.
   */
  it('should logout and remove token', () => {
    localStorage.setItem('token', 'mock-token');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
