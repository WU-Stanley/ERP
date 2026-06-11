import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule, CommonModule],
  selector: 'lib-switcher-fab',
  templateUrl: './app-switcher-fab.component.html',
  styleUrls: ['./app-switcher-fab.component.css'],
})
export class AppSwitcherFabComponent {
  menuOpen = false;
  apps = [
    { name: 'HR', path: '/hr', icon: 'groups', color: 'bg-wigwe-green' },
    { name: 'LMS', path: '/lms', icon: 'school', color: 'bg-indigo-600' },
    { name: 'Assets', path: '/assets', icon: 'construction', color: 'bg-amber-500' },
    { name: 'Finance', path: '/finance', icon: 'account_balance_wallet', color: 'bg-emerald-600' },
    { name: 'Inventory', path: '/inventory', icon: 'inventory_2', color: 'bg-sky-600' },
    { name: 'Projects', path: '/projects', icon: 'analytics', color: 'bg-violet-600' },
    { name: 'CRM', path: '/crm', icon: 'handshake', color: 'bg-rose-600' },
    { name: 'Payroll', path: '/payroll', icon: 'payments', color: 'bg-teal-600' },
    { name: 'Recruitment', path: '/recruitment', icon: 'assignment_ind', color: 'bg-slate-700' },
    { name: 'Settings', path: '/auth/', icon: 'settings', color: 'bg-wigwe-navy' },
  ];

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeMenu();
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleMenu();
    }
  }

  trackByName(_: number, app: { name: string }) {
    return app.name;
  }
}
