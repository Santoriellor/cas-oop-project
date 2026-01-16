import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  sidebarOpen = false;
  user: any = null;

  constructor(private auth: AuthService) {
    this.auth.me().subscribe(u => this.user = u);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    this.auth.logout();
    window.location.href = '/login';
  }

  isAdmin(): boolean {
    return this.user && this.user.roles && this.user.roles.includes('ROLE_ADMIN');
  }

  isUser(): boolean {
    return this.user && this.user.roles && this.user.roles.includes('ROLE_USER');
  }
}
