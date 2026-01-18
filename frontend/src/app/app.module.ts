import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { WelcomeComponent } from './welcome/welcome.component';
import {AuthInterceptor} from "./interceptor/auth.interceptor";
import {LayoutComponent} from "./layout/layout.component";
import {CommonModule} from "@angular/common";
import {AdminDashboardComponent} from "./admindashboard/admin-dashboard.component";
import {UserDashboardComponent} from "./userdashboard/user-dashboard.component";
import {CoursesListComponent} from "./courseslist/courses-list.component";
import {ConnectionStatusComponent} from "./connection-status/connection-status.component";

/**
 * Root Angular module.
 *
 * <p>
 * This module configures the core building blocks of the application:
 * </p>
 *
 * <ul>
 *   <li>Root and feature components</li>
 *   <li>HTTP and form support</li>
 *   <li>Routing configuration</li>
 *   <li>Global HTTP interceptors</li>
 * </ul>
 */
@NgModule({

  /**
   * Components that belong to this module.
   */
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    WelcomeComponent,
    LayoutComponent,
    AdminDashboardComponent,
    UserDashboardComponent,
    CoursesListComponent
  ],

  /**
   * Imported Angular and application modules.
   */
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    CommonModule,

    // Standalone component providing backend connection status
    ConnectionStatusComponent
  ],

  /**
   * Application-wide service providers.
   */
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],

  /**
   * Root component bootstrapped at application startup.
   */
  bootstrap: [AppComponent]
})
export class AppModule {
  // Root module for the application
}
