import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../auth.service';
import { HasAnyPermissionDirective } from '../directives/has-permissions.directive';
import { Permissions } from '../enums/permissions.enum';

@Component({
  selector: 'lib-auth-dashboard',
  templateUrl: './auth-dashboard.component.html',
  styleUrls: ['./auth-dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule,
    HasAnyPermissionDirective,
  ],
})
export class AuthDashboardComponent implements OnInit {
  isCollapsed = false;
  Permissions = Permissions;
  dropdownOpen = false;
  referencesOpen = false;
  menuItems = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/auth/dashboard',
    permissions: [Permissions.AccessDashboard, Permissions.AdminAccess, Permissions.SuperAdminAccess],
  },
  {
    label: 'Manage Staff Roles',
    icon: 'security',
    route: '/auth/manage-staff-role',
    permissions: [Permissions.ManageRoles, Permissions.AdminAccess, Permissions.SuperAdminAccess],

  },
  {
    label: 'Manage Staff Permissions',
    icon: 'rule',
    route: '/auth/manage-staff-permission',
    permissions: [Permissions.ManagePermissions, Permissions.AdminAccess, Permissions.SuperAdminAccess],
  },
  {
    label: 'Create New Staff',
    icon: 'person_add',
    route: '/auth/add-staff',
    permissions: [Permissions.CreateUser, Permissions.EditUser, Permissions.AdminAccess, Permissions.SuperAdminAccess],
  },
  {
    label: 'Manage Roles',
    icon: 'admin_panel_settings',
    route: '/auth/mroles',
    permissions: [Permissions.ManageRoles, Permissions.ViewRoles, Permissions.AdminAccess, Permissions.SuperAdminAccess],
  },
  {
    label: 'References',
    icon: 'list',
    permissions: [Permissions.AccessDashboard, Permissions.AdminAccess, Permissions.SuperAdminAccess],
    children: [
      {
        label: 'Departments',
        route: '/references/departments',
      },
      {
        label: 'Roles',
        route: '/references/roles',
      },
      {
        label: 'User Types',
        route: '/references/user-types',
      },
      {
        label: 'Employment Types',
        route: '/references/employment-types',
      },
    ],
  },
  {
    permissions: ['AccessDashboard', 'AdminAccess', 'SuperAdminAccess'],
    label: 'Settings',
    icon: 'settings',
    route: '/settings',
  },
];

  user = (() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  })();
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
   const currentBase = this.router.url.split('/')[1]; // 'auth' or 'references'
  // if (this.user?.isDefault) {
  //   this.router.navigate([`/${currentBase}/change-password`]);
  // }
  }
  openedMenus: Record<string, boolean> = {};

toggleMenu(label: string): void {
  this.openedMenus[label] = !this.openedMenus[label];
}


  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  navigateToDashboard() {
    this.router.navigate(['/auth']);
  }

  logout() {
    this.authService.logout();
  }
}
