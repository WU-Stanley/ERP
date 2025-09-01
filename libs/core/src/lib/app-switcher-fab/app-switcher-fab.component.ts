import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule, CommonModule],
  selector: 'lib-switcher-fab',
  templateUrl: './app-switcher-fab.component.html',
  styleUrls: ['./app-switcher-fab.component.css'],
})
export class AppSwitcherFabComponent {
  @Input() position: 'left' | 'right' = 'right'; // configurable
  menuOpen = false;
  private closeTimeout: any;
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
    { name: 'Settings', path: '/auth/', icon: '⚙️' },
  ];

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      setTimeout(() => {
        this.menuOpen = false; // Close the menu after a short delay
      }, 3000); // Adjust the delay as needed
    }
  }

  openMenu() {
    clearTimeout(this.closeTimeout);
    this.menuOpen = true;
  }

  scheduleClose() {
    this.closeTimeout = setTimeout(() => {
      this.menuOpen = false;
    }, 3000); // 3s delay before closing
  }
}
