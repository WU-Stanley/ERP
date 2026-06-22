import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, HasAnyPermissionDirective, Permissions } from '@erp/auth';
import { AppSwitcherFabComponent } from '@erp/core';
import { NotificationBellComponent } from '../notification-bell/notification-bell.component';

@Component({
  selector: 'lib-hr-dashboard',
  templateUrl: './hr-dashboard.component.html',
  styleUrls: ['./hr-dashboard.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    HasAnyPermissionDirective,
    AppSwitcherFabComponent,
    NotificationBellComponent,
  ],
})
export class HrDashboardComponent implements OnInit {
  isCollapsed = false;
  Permissions = Permissions;
  dropdownOpen = false;
  referencesOpen = false;
  menuItems = [
    {
      label: 'My Profile',
      icon: 'account_circle',
      route: '/hr/profile',
      permissions: [],
    },
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/hr/dashboard',
      permissions: [
        Permissions.AccessDashboard,
        Permissions.AdminAccess,
        Permissions.SuperAdminAccess,
      ],
    },
    {
      label: 'Employees',
      icon: 'people',
      permissions: [
        Permissions.ViewEmployeeProfiles,
        Permissions.CreateUser,
        Permissions.ManageUsers,
        Permissions.InitiateOnboarding,
        Permissions.CompleteOnboarding,
        Permissions.AdminAccess,
        Permissions.SuperAdminAccess,
      ],
      children: [
        {
          label: 'Employee Directory',
          icon: 'badge',
          route: '/hr/employees',
          permissions: [
            Permissions.ViewEmployeeProfiles,
            Permissions.ViewDepartmentEmployeeProfiles,
            Permissions.ManageUsers,
            Permissions.AdminAccess,
            Permissions.SuperAdminAccess,
          ],
        },
        {
          label: 'Department Employees',
          icon: 'groups',
          route: '/hr/departments',
          permissions: [
            Permissions.ViewDepartmentEmployeeProfiles,
            Permissions.ViewEmployeeProfiles,
            Permissions.AdminAccess,
            Permissions.SuperAdminAccess,
          ],
        },
        {
          label: 'Add Staff',
          icon: 'person_add',
          route: '/hr/employees/onboarding',
          permissions: [
            Permissions.CreateUser,
            Permissions.ManageUsers,
            Permissions.AdminAccess,
            Permissions.SuperAdminAccess,
          ],
        },
        {
          label: 'ICT Onboarding',
          icon: 'manage_accounts',
          route: '/hr/employees/ict-onboarding',
          permissions: [
            Permissions.InitiateOnboarding,
            Permissions.CompleteOnboarding,
            Permissions.AdminAccess,
            Permissions.SuperAdminAccess,
          ],
        },
        {
          label: 'Bulk Staff Upload',
          icon: 'upload_file',
          route: '/hr/employees/bulk-upload',
          permissions: [
            Permissions.CreateUser,
            Permissions.ManageUsers,
            Permissions.AdminAccess,
            Permissions.SuperAdminAccess,
          ],
        },
        {
          label: 'Profile Updates',
          icon: 'rule',
          route: '/hr/employees/profile-updates',
          permissions: [
            Permissions.ApproveProfileUpdateInDepartment,
            Permissions.UpdateEmployeeProfiles,
            Permissions.ManageUsers,
            Permissions.AdminAccess,
            Permissions.SuperAdminAccess,
          ],
        },
      ],
    },
    {
      label: 'Leave',
      icon: 'event_available',
      children: [
        {
          label: 'Leave Requests',
          icon: 'event_note',
          route: '/hr/leave/requests',
          permissions: [],
        },
        {
          label: 'Leave Types',
          icon: 'category',
          route: '/hr/leave/types',
          permissions: [
            Permissions.ManageLeaveRequests,
            Permissions.ManageLeave,
            Permissions.AdminAccess,
            Permissions.SuperAdminAccess,
          ],
        },
        {
          label: 'Leave Policies',
          icon: 'policy',
          route: '/hr/leave/policies',
          permissions: [
            Permissions.ManageLeaveRequests,
            Permissions.ManageLeave,
            Permissions.AdminAccess,
            Permissions.SuperAdminAccess,
          ],
        },
        {
          label: 'Approval Workflow',
          icon: 'account_tree',
          route: '/hr/leave/approval-workflow',
          permissions: [
            Permissions.ManageLeaveRequests,
            Permissions.ManageLeave,
            Permissions.AdminAccess,
            Permissions.SuperAdminAccess,
          ],
        },

        {
          label: 'Leave Reports',
          icon: 'bar_chart',
          route: '/hr/leave/reports',
          permissions: [
            Permissions.ViewLeaveReports,
            Permissions.ViewHRReports,
            Permissions.AdminAccess,
            Permissions.SuperAdminAccess,
          ],
        },
        {
          label: 'Leave Approval',
          icon: 'task_alt',
          route: '/hr/leave/approval',
          permissions: [
            Permissions.ApproveLeave,
            Permissions.AdminAccess,
            Permissions.SuperAdminAccess,
          ],
        },
      ],
    },
    {
      label: 'Payroll',
      icon: 'account_balance',
      permissions: [],
      children: [
        {
          label: 'Payroll Dashboard',
          icon: 'dashboard',
          route: '/hr/payroll/dashboard',
        },
        {
          label: 'Payslips',
          icon: 'receipt_long',
          route: '/hr/payroll/payslips',
          permissions: [
            Permissions.ViewPayslips,
            Permissions.AdminAccess,
            Permissions.SuperAdminAccess,
          ],
        },
        {
          label: 'Salary Structure',
          icon: 'account_balance',
          route: '/hr/payroll/salary-structure',
          permissions: [
            Permissions.UpdateSalaryStructure,
            Permissions.AdminAccess,
            Permissions.SuperAdminAccess,
          ],
        },
        {
          label: 'Bonuses',
          icon: 'add_card',
          route: '/hr/payroll/bonuses',
          permissions: [
            Permissions.ManageBonuses,
            Permissions.AdminAccess,
            Permissions.SuperAdminAccess,
          ],
        },
        {
          label: 'Deductions',
          icon: 'remove_circle',
          route: '/hr/payroll/deductions',
          permissions: [
            Permissions.ManageDeductions,
            Permissions.AdminAccess,
            Permissions.SuperAdminAccess,
          ],
        },
      ],
    },
    {
      label: 'Documents',
      icon: 'description',
      permissions: [
        Permissions.UploadDocuments,
        Permissions.ApproveDocuments,
        Permissions.AdminAccess,
        Permissions.SuperAdminAccess,
      ],
      children: [
        {
          label: 'Upload Documents',
          icon: 'upload_file',
          route: '/hr/documents/upload',
        },
        {
          label: 'Approve Documents',
          icon: 'fact_check',
          route: '/hr/documents/approve',
        },
        {
          label: 'Archive Documents',
          icon: 'inventory_2',
          route: '/hr/documents/archive',
        },
        {
          label: 'Delete Documents',
          icon: 'delete',
          route: '/hr/documents/delete',
        },
        {
          label: 'View Department Documents',
          icon: 'folder_shared',
          route: '/hr/documents/department',
        },
      ],
    },
    {
      label: 'ERP Modules',
      icon: 'apps',
      permissions: [
        Permissions.AccessDashboard,
        Permissions.AdminAccess,
        Permissions.SuperAdminAccess,
      ],
      children: [
        {
          label: 'Finance',
          icon: 'account_balance_wallet',
          route: '/finance',
          permissions: [
            Permissions.ManagePayroll,
            Permissions.ProcessPayroll,
            Permissions.AdminAccess,
            Permissions.SuperAdminAccess,
          ],
        },
        {
          label: 'Procurement',
          icon: 'shopping_cart',
          route: '/procurement',
          permissions: [
            Permissions.AdminAccess,
            Permissions.ManageDepartmentStructure,
            Permissions.SuperAdminAccess,
          ],
        },
        {
          label: 'Inventory',
          icon: 'inventory_2',
          route: '/procurement/inventory',
          permissions: [
            Permissions.AdminAccess,
            Permissions.ManageDepartmentStructure,
            Permissions.SuperAdminAccess,
          ],
        },
        {
          label: 'Helpdesk',
          icon: 'support_agent',
          route: '/hr/helpdesk',
          permissions: [
            Permissions.AccessDashboard,
            Permissions.AdminAccess,
            Permissions.SuperAdminAccess,
          ],
        },
        {
          label: 'Facilities & Assets',
          icon: 'construction',
          route: '/facilities',
          permissions: [
            Permissions.AdminAccess,
            Permissions.ManageDepartmentStructure,
            Permissions.SuperAdminAccess,
          ],
        },
        {
          label: 'Registry / LMS',
          icon: 'school',
          route: '/registry',
          permissions: [
            Permissions.AccessDashboard,
            Permissions.AdminAccess,
            Permissions.SuperAdminAccess,
          ],
        },
      ],
    },
    {
      label: 'Departments',
      icon: 'business',
      route: '/hr/departments',
      permissions: [
        Permissions.CreateDepartment,
        Permissions.EditDepartment,
        Permissions.DeleteDepartment,
        Permissions.AssignDepartmentHead,
        Permissions.ManageDepartmentStructure,
        Permissions.AdminAccess,
        Permissions.SuperAdminAccess,
      ],
    },
    {
      label: 'Recruitment',
      icon: 'work',
      permissions: [
        Permissions.AdminAccess,
        Permissions.SuperAdminAccess,
      ],
      children: [
        {
          label: 'Dashboard',
          icon: 'dashboard',
          route: '/hr/recruitment',
          permissions: [
            Permissions.AdminAccess,
            Permissions.SuperAdminAccess,
          ],
        },
        {
          label: 'Job Postings',
          icon: 'business_center',
          route: '/hr/recruitment/job-postings',
          permissions: [
            Permissions.AdminAccess,
            Permissions.SuperAdminAccess,
          ],
        },
        {
          label: 'Applications',
          icon: 'description',
          route: '/hr/recruitment/applications',
          permissions: [
            Permissions.AdminAccess,
            Permissions.SuperAdminAccess,
          ],
        },
      ],
    },
    {
      label: 'Reports',
      icon: 'bar_chart',
      permissions: [
        Permissions.ViewHRReports,
        Permissions.GenerateDepartmentReports,
        Permissions.ExportData,
        Permissions.SuperAdminAccess,
      ],
      children: [
        {
          label: 'HR Reports',
          icon: 'analytics',
          route: '/hr/reports/hr',
        },
        {
          label: 'Department Reports',
          icon: 'summarize',
          route: '/hr/reports/department',
        },
        {
          label: 'Export Data',
          icon: 'ios_share',
          route: '/hr/reports/export',
        },
      ],
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
