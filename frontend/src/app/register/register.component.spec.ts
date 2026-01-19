import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ConnectionStatusComponent } from '../connection-status/connection-status.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';

/**
 * Unit tests for the {@link RegisterComponent}.
 *
 * <p>
 * These tests validate the registration workflow, including:
 * </p>
 *
 * <ul>
 *   <li>Component creation</li>
 *   <li>Successful registration and redirection</li>
 *   <li>Email availability checking</li>
 *   <li>Username availability checking</li>
 * </ul>
 */
describe('RegisterComponent', () => {

  /**
   * Component instance under test.
   */
  let component: RegisterComponent;

  /**
   * Test fixture for accessing component instance and DOM.
   */
  let fixture: ComponentFixture<RegisterComponent>;

  /**
   * Mocked authentication service.
   */
  let authService: jasmine.SpyObj<AuthService>;

  /**
   * Angular router used for navigation assertions.
   */
  let router: Router;

  /**
   * Configures the testing module with mocked services and dependencies.
   */
  beforeEach(async () => {
    // Create a spy object for AuthService
    const authSpy = jasmine.createSpyObj('AuthService', [
      'register',
      'checkEmailAvailable',
      'checkUsernameAvailable'
    ]);

    await TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports: [
        FormsModule,
        CommonModule,
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
   * Creates a fresh component instance before each test.
   */

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
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
   * Verifies successful user registration behavior.
   *
   * <p>
   * Ensures that:
   * </p>
   * <ul>
   *   <li>The register service is called with correct parameters</li>
   *   <li>A success message is shown</li>
   *   <li>The user is redirected to the login page after a delay</li>
   * </ul>
   */
  it('should call register and navigate on success', fakeAsync(() => {
    authService.register.and.returnValue(of({}));
    spyOn(router, 'navigate');

    component.email = 'test@example.com';
    component.username = 'testuser';
    component.password = 'password';
    component.isUser = true;
    component.isAdmin = false;

    component.register();

    expect(authService.register).toHaveBeenCalledWith('test@example.com', 'testuser', 'password', true, false);
    expect(component.message).toContain('Inscription réussie');

    // Simulate delay before navigation
    tick(1000);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));

  /**
   * Verifies email availability check behavior.
   */
  it('should check email availability', fakeAsync(() => {
    authService.checkEmailAvailable.and.returnValue(of({ available: true }));

    component.onEmailChange('new@example.com');
    tick(300);

    expect(authService.checkEmailAvailable).toHaveBeenCalledWith('new@example.com');
    expect(component.emailAvailable).toBeTrue();
  }));

  /**
   * Verifies username availability check behavior.
   */
  it('should check username availability', fakeAsync(() => {
    authService.checkUsernameAvailable.and.returnValue(of({ available: false }));

    component.onUsernameChange('takenuser');
    tick(300);

    expect(authService.checkUsernameAvailable).toHaveBeenCalledWith('takenuser');
    expect(component.usernameAvailable).toBeFalse();
  }));
});
