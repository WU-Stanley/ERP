import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";


@Component({
  imports:[RouterModule,CommonModule],
  selector: 'lib-switcher-fab',
  template: `
    <div class="fixed bottom-6 right-6 z-50">
      <button
        (click)="toggleMenu()" (mouseenter)="toggleMenu()" 
        class="bg-green-900 hover:bg-green-500 text-white p-4 rounded-full shadow-lg focus:outline-none transition-transform"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
             viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <div
        *ngIf="menuOpen"
        class="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg p-2 space-y-2 w-48"
      >
        <a
          *ngFor="let app of apps"
          [routerLink]="app.path"
          class="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded transition"
          (click)="menuOpen = false"
        >
          <span>{{ app.icon }}</span>
          <span>{{ app.name }}</span>
        </a>
      </div>
    </div>
  `
})
export class AppSwitcherFabComponent {
  menuOpen = false;
  apps = [
    { name: 'HR', path: '/hr', icon: '📋' },
    { name: 'LMS', path: '/lms', icon: '🎓' },
    { name: 'Assets', path: '/assets', icon: '🛠️' },
    { name: 'Finance', path: '/finance', icon: '💰' },
    { name: 'Inventory', path: '/inventory', icon: '📦' },
    { name: 'Projects', path: '/projects', icon: '📊' },
    { name: 'CRM', path: '/crm', icon: '🤝' },
    { name: 'Payroll', path: '/payroll', icon: '💵' },
    { name: 'Recruitment', path: '/recruitment', icon: '📝' },
    { name: 'Settings', path: '/auth/', icon: '⚙️' }
  ];

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      setTimeout(() => {
        this.menuOpen = false; // Close the menu after a short delay
      }, 5000); // Adjust the delay as needed
    }
  }
}
