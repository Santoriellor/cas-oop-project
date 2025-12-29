import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ConnectionStatusComponent } from '../connection-status/connection-status.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'saveToken']);

    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        ConnectionStatusComponent // It's standalone
      ],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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

  it('should set error message on failure', () => {
    const errorRes = { error: { error: 'Invalid credentials' } };
    authService.login.and.returnValue(throwError(() => errorRes));

    component.login();

    expect(component.error).toBe('Invalid credentials');
  });
});
