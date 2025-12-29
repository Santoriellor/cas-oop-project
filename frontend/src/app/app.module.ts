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

@NgModule({
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
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    CommonModule,
    ConnectionStatusComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
