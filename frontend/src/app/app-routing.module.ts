import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuard } from './guard/auth.guard';
import {LayoutComponent} from "./layout/layout.component";
import {AdminDashboardComponent} from "./admindashboard/admin-dashboard.component";
import {UserDashboardComponent} from "./userdashboard/user-dashboard.component";
import {CoursesListComponent} from "./courseslist/courses-list.component";

import { CourseDocumentsComponent} from "./course-documents/course-documents";

/**
 * Application routing configuration.
 *
 * <p>
 * Defines all public and protected routes of the application
 * and maps them to their corresponding components.
 * </p>
 */
const routes: Routes = [

  /**
   * Default route.
   *
   * Redirects the root path to the welcome page.
   */
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },

  /**
   * Public authentication routes.
   */
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  /**
   * Protected application routes.
   *
   * <p>
   * All authenticated pages are rendered inside the LayoutComponent
   * and guarded by the AuthGuard.
   * </p>
   */
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'welcome', component: WelcomeComponent },
      { path: 'admin', component: AdminDashboardComponent },
      { path: 'userdashboard', component: UserDashboardComponent },
      { path: 'courses', component: CoursesListComponent },
      // Additional protected routes can be added here
    ]
  },

  /**
   * Course documents route.
   *
   * <p>
   * Displays documents for a specific course and
   * requires authentication.
   * </p>
   */
  {
    path: 'courses/:courseId/documents',
    component: CourseDocumentsComponent,
    canActivate: [AuthGuard]
  },

  /**
   * Wildcard fallback route.
   *
   * Redirects all unknown paths to the login page.
   */
  { path: '**', redirectTo: '/login' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  // Central routing module for the application
}
