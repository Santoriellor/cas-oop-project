import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-layout',
  template: `
    <div class="flex h-screen bg-gray-50">
      <!-- Sidebar -->
      <aside
        [class.translate-x-0]="sidebarOpen"
        [class.-translate-x-full]="!sidebarOpen"
        class="fixed z-20 inset-y-0 left-0 w-64 bg-gray-800 text-white p-4 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">Sidebar</h2>
          <button class="md:hidden text-gray-300" (click)="toggleSidebar()">✕</button>
        </div>
        <p>Some placeholder info here</p>
      </aside>

      <!-- Overlay for mobile sidebar -->
      <div
        class="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
        *ngIf="sidebarOpen"
        (click)="toggleSidebar()"
      ></div>

      <!-- Main content area -->
      <div class="flex-1 flex flex-col">
        <!-- Topbar -->
        <header class="bg-indigo-600 text-white flex justify-between items-center px-6 py-3 shadow">
          <div class="flex items-center gap-4">
            <!-- Mobile menu button -->
            <button class="md:hidden" (click)="toggleSidebar()">☰</button>
            <div>
              <h1 class="text-lg font-semibold">MyApp</h1>
              <p class="text-sm opacity-80">Welcome / Dashboard</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span *ngIf="user">{{ user.username }}</span>
            <span *ngIf="user" class="px-2 py-1 bg-green-500 text-white rounded-full text-xs">Online</span>
            <button (click)="logout()" class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white text-sm">
              Logout
            </button>
          </div>
        </header>

        <!-- Page content -->
        <main class="flex-1 p-6 overflow-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    /* Smooth transform for sidebar */
    aside { min-height: 100vh; }
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
}
