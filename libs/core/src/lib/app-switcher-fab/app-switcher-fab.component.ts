import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

type AppSwitcherItem = {
  name: string;
  path: string;
  icon: string;
  color: string;
  external?: boolean;
};

@Component({
  imports: [RouterModule, CommonModule],
  selector: 'lib-switcher-fab',
  templateUrl: './app-switcher-fab.component.html',
  styleUrls: ['./app-switcher-fab.component.css'],
})
export class AppSwitcherFabComponent {
  menuOpen = false;
  apps: AppSwitcherItem[] = [
    { name: 'HR', path: '/hr', icon: 'groups', color: 'bg-wigwe-green' },
    {
      name: 'WU Portal',
      path: 'https://portal.wigweuniversity.edu.ng/wuportal',
      icon: 'school',
      color: 'bg-indigo-600',
      external: true,
    },
    {
      name: 'Cafeteria',
      path: 'https://portal.wigweuniversity.edu.ng/cafiteria',
      icon: 'restaurant',
      color: 'bg-orange-500',
      external: true,
    },
    { name: 'Assets', path: '/facilities/assets', icon: 'construction', color: 'bg-amber-500' },
    { name: 'Finance', path: '/finance', icon: 'account_balance_wallet', color: 'bg-emerald-600' },
    { name: 'Inventory', path: '/procurement/inventory', icon: 'inventory_2', color: 'bg-sky-600' },
    { name: 'Helpdesk', path: '/helpdesk', icon: 'support_agent', color: 'bg-rose-600' },
    { name: 'Registry', path: '/registry', icon: 'folder_managed', color: 'bg-wigwe-green' },
    { name: 'Projects', path: '/projects', icon: 'analytics', color: 'bg-violet-600' },
    { name: 'CRM', path: '/crm', icon: 'handshake', color: 'bg-rose-600' },
    { name: 'Payroll', path: '/hr/payroll/dashboard', icon: 'payments', color: 'bg-teal-600' },
    { name: 'Recruitment', path: '/hr/recruitment', icon: 'assignment_ind', color: 'bg-slate-700' },
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

  trackByName(_: number, app: AppSwitcherItem) {
    return app.name;
  }
}
