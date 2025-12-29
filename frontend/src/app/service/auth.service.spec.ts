import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

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
    req.flush(mockResponse);
  });

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
    req.flush(mockResponse);
  });

  it('should get current user info', () => {
    const mockUser = { email: 'test@example.com', username: 'testuser' };
    localStorage.setItem('token', 'mock-token');

    service.me().subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/me`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(mockUser);
  });

  it('should logout and remove token', () => {
    localStorage.setItem('token', 'mock-token');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
