import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-layout',
  template: `
    <div class="flex flex-col h-screen bg-gray-50">
      <!-- Topbar -->
      <header class="bg-indigo-600 text-white flex justify-between items-center px-6 py-3 shadow z-30">
        <div class="flex items-center gap-4">
          <!-- Mobile menu button -->
          <button class="md:hidden" (click)="toggleSidebar()">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h1 class="text-lg font-semibold"><span *ngIf="user" class="hidden sm:inline">{{ user.username }}</span></h1>
            <p class="text-sm opacity-80">Dashboard</p>
          </div>
          <app-connection-status></app-connection-status>
        </div>
        <div class="flex items-center gap-4">


          <!-- Profile Icon -->
          <button *ngIf="user" title="Profile" class="p-1 hover:bg-indigo-500 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          <!-- Settings Icon -->
          <button *ngIf="user" title="Settings" class="p-1 hover:bg-indigo-500 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          <!-- Logout Button -->
          <button (click)="logout()" class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white text-sm flex items-center gap-2">
            <span class="hidden md:inline">Logout</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      <div class="flex flex-1 overflow-hidden">
        <!-- Sidebar -->
        <aside
          [class.translate-x-0]="sidebarOpen"
          [class.-translate-x-full]="!sidebarOpen"
          class="fixed z-20 inset-y-0 left-0 w-64 bg-gray-800 text-white p-4 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto"
        >
          <div class="flex items-center justify-between mb-6 md:hidden">
            <h2 class="text-xl font-semibold">Sidebar</h2>
            <button class="text-gray-300" (click)="toggleSidebar()">✕</button>
          </div>
          <nav class="flex flex-col gap-2">
            <a routerLink="/welcome" class="hover:bg-gray-700 p-2 rounded">Welcome</a>
            <a *ngIf="isUser()" routerLink="/userdashboard" class="hover:bg-gray-700 p-2 rounded text-blue-400">User Dashboard</a>
            <a routerLink="/courses" class="hover:bg-gray-700 p-2 rounded">Kurse</a>
            <a *ngIf="isAdmin()" routerLink="/admin" class="hover:bg-gray-700 p-2 rounded text-yellow-400">Admin Dashboard</a>
          </nav>
        </aside>

        <!-- Overlay for mobile sidebar -->
        <div
          class="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          *ngIf="sidebarOpen"
          (click)="toggleSidebar()"
        ></div>

        <!-- Page content -->
        <main class="flex-1 p-6 overflow-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    /* Smooth transform for sidebar */
    aside { min-height: calc(100vh - 64px); }
  `]
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
