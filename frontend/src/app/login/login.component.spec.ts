import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ConnectionStatusComponent } from '../connection-status/connection-status.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

/**
 * Unit tests for the {@link LoginComponent}.
 *
 * <p>
 * These tests verify the login flow, including:
 * </p>
 *
 * <ul>
 *   <li>Component creation</li>
 *   <li>Successful login and navigation</li>
 *   <li>Error handling on failed login attempts</li>
 * </ul>
 */
describe('LoginComponent', () => {

  /**
   * Component instance under test.
   */
  let component: LoginComponent;

  /**
   * Test fixture providing access to the component and DOM.
   */
  let fixture: ComponentFixture<LoginComponent>;

  /**
   * Mocked authentication service.
   */
  let authService: jasmine.SpyObj<AuthService>;

  /**
   * Angular router used for navigation assertions.
   */
  let router: Router;

  /**
   * Configures the testing module and provides mocked dependencies.
   */
  beforeEach(async () => {
    // Create a spy object for AuthService
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'saveToken']);

    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        ConnectionStatusComponent // Standalone component used in the template
      ],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  /**
   * Creates the component instance before each test.
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Verifies that the component is created successfully.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Verifies successful login behavior.
   *
   * <p>
   * Ensures that:
   * </p>
   * <ul>
   *   <li>The login service is called with correct credentials</li>
   *   <li>The authentication token is stored</li>
   *   <li>The user is redirected to the welcome page</li>
   * </ul>
   */
  it('should call login and navigate on success', () => {
    const mockRes = { token: 'mock-token' };
    authService.login.and.returnValue(of(mockRes));
    spyOn(router, 'navigate');

    component.email = 'test@example.com';
    component.password = 'password';
    component.login();

    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password');
    expect(authService.saveToken).toHaveBeenCalledWith('mock-token');
    expect(router.navigate).toHaveBeenCalledWith(['/welcome']);
  });

  /**
   * Verifies error handling when login fails.
   *
   * <p>
   * Ensures that an appropriate error message is displayed
   * when authentication fails.
   * </p>
   */
  it('should set error message on failure', () => {
    const errorRes = { error: { error: 'Invalid credentials' } };
    authService.login.and.returnValue(throwError(() => errorRes));

    component.login();

    expect(component.error).toBe('Invalid credentials');
  });
});
