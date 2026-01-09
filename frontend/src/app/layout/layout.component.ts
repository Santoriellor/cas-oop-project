import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-layout',
  template: `
    <div class="app-shell">
      <!-- Topbar -->
      <header class="topbar">
        <div class="topbar__inner">

          <div class="topbar__left">
            <a class="brand" routerLink="/welcome" aria-label="Zur Startseite">
              <span class="brand__logoWrap">
              <img class="brand__logo" src="/assets/logo.png" alt="ReTrainEd" />
              </span>
            </a>

            <button class="icon-btn" (click)="toggleSidebar()" aria-label="Menü öffnen">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div class="topbar__meta">
              <div class="topbar__user" *ngIf="user">{{ user.username }}</div>
              <div class="topbar__subtitle">Dashboard</div>
            </div>

            <div class="net-pill">
              <app-connection-status></app-connection-status>
            </div>
          </div>

          <div class="row">
            <button *ngIf="user" title="Profile" class="icon-btn" aria-label="Profil">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            <button *ngIf="user" title="Settings" class="icon-btn" aria-label="Einstellung">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round"stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </button>

            <button (click)="logout()" class="btn btn-danger" aria-label="Logout">
              <span>Logout</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>

        </div>
      </header>

      <div class="app-layout">

        <aside class="sidebar" [class.sidebar--open]="sidebarOpen">
          <div class="sidebar__header">
            <h2 class="sidebar__title">Navigation</h2>
            <button class="sidebar__close" type="button" (click)="toggleSidebar()">X</button>
          </div>

          <nav class="sidebar__nav">
            <a routerLink="/welcome"
            routerLinkActive="sidebar__link--active"
            class="sidebar__link">Welcome</a>

            <a *ngIf="isUser()"
            routerLink="/userdashboard"
            routerLinkActive="sidebar__link--active"
            class="sidebar__link">User Dashboard</a>

            <a routerLink="/courses"
            routerLinkActive="sidebar__link--active"
            class="sidebar__link">Kurse</a>

            <a *ngIf="isAdmin()"
               routerLink="/admin"
               routerLinkActive="sidebar__link--active"
               class="sidebar__link">Admin</a>/
          </nav>
        </aside>

        <div class="sidebar-overlay" *ngIf="sidebarOpen" (click)="toggleSidebar()"></div>

        <main class="app-content">
          <router-outlet></router-outlet>
        </main>
      </div>

    </div>
  `,
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
