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

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
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
        ConnectionStatusComponent
      ],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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

    tick(1000);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should check email availability', fakeAsync(() => {
    authService.checkEmailAvailable.and.returnValue(of({ available: true }));

    component.onEmailChange('new@example.com');
    tick(300);

    expect(authService.checkEmailAvailable).toHaveBeenCalledWith('new@example.com');
    expect(component.emailAvailable).toBeTrue();
  }));

  it('should check username availability', fakeAsync(() => {
    authService.checkUsernameAvailable.and.returnValue(of({ available: false }));

    component.onUsernameChange('takenuser');
    tick(300);

    expect(authService.checkUsernameAvailable).toHaveBeenCalledWith('takenuser');
    expect(component.usernameAvailable).toBeFalse();
  }));
});
