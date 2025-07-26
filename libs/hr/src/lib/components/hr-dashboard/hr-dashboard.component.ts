import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {AuthService, HasAnyPermissionDirective,Permissions} from '@erp/auth';

@Component({
  selector: 'lib-hr-dashboard',
  templateUrl: './hr-dashboard.component.html',
  styleUrls: ['./hr-dashboard.component.css'], imports: [
    CommonModule,
    RouterModule,  
    HasAnyPermissionDirective,
  ],
})
export class HrDashboardComponent implements OnInit {
 isCollapsed = false;
  Permissions = Permissions;
  dropdownOpen = false;
  referencesOpen = false;
  menuItems = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/hr/dashboard',
    permissions: [Permissions.AccessDashboard, Permissions.AdminAccess, Permissions.SuperAdminAccess],
  }, 
  {
    label: 'Employees',
    icon: 'people',
    permissions: [Permissions.ViewEmployeeProfiles, Permissions.AdminAccess, Permissions.SuperAdminAccess],
    children: [
      {label:"Dashboard", route: '/hr/employees/dashboard'},
      {
        label: 'Employee Profiles',
        route: '/hr/employees/profiles',
      },
      {
        label: 'Department Employees',
        route: '/hr/employees/department-profiles',
      },
      {
        label: 'Onboarding',
        route: '/hr/employees/onboarding',
      },
      {
        label: 'Offboarding',
        route: '/hr/employees/offboarding',
      },
    ],
  },
  { 
  
    label: 'Leave',
    icon: 'home',
    permissions: ['AccessDashboard', 'AdminAccess', 'SuperAdminAccess'],
    children: [
      {
        label: 'Leave Requests',
        route: '/hr/leave/requests',
      },
      {
        label: 'Leave Types',
        route: '/hr/leave/types',
        // permissions: [Permissions.ManageLeaveRequests,Permissions.ManageLeave, Permissions.AdminAccess, Permissions.SuperAdminAccess],
      },
      {
        label: 'Leave Policies',
        route: '/hr/leave/policies',
        //  permissions: [Permissions.ManageLeaveRequests,Permissions.ManageLeave, Permissions.AdminAccess, Permissions.SuperAdminAccess],
      
      },
      {
        label: 'Approval Workflow',
        route: '/hr/leave/approval-workflow',
        // permissions: [Permissions.ManageLeaveRequests,Permissions.ManageLeave, Permissions.AdminAccess, Permissions.SuperAdminAccess],
      },
      
      { 
        label: 'Leave Reports',
        route: '/hr/leave/reports',
        permissions: [Permissions.ViewLeaveReports,Permissions.ViewHRReports, Permissions.AdminAccess, Permissions.SuperAdminAccess],
      },
      {
        label: "Leave Approval",
        route: "/hr/leave/approval",
        permissions: [Permissions.ApproveLeave, Permissions.AdminAccess, Permissions.SuperAdminAccess],
      }
    ],
  },
 {
  label: 'Payroll',
  icon: 'account_balance',
  permissions: [Permissions.ManagePayroll, Permissions.AdminAccess, Permissions.SuperAdminAccess],
  children: [
    {
      label: 'Payroll Dashboard',
      route: '/hr/payroll/dashboard',
    },
    {
      label: 'Payslips',
      route: '/hr/payroll/payslips',
      permissions: [Permissions.ViewPayslips, Permissions.AdminAccess, Permissions.SuperAdminAccess],
    },
    {
      label: 'Salary Structure',
      route: '/hr/payroll/salary-structure',
      permissions: [Permissions.UpdateSalaryStructure, Permissions.AdminAccess, Permissions.SuperAdminAccess],
    },
    {
      label: 'Bonuses',
      route: '/hr/payroll/bonuses',
      permissions: [Permissions.ManageBonuses, Permissions.AdminAccess, Permissions.SuperAdminAccess],
    },
    {
      label: 'Deductions',
      route: '/hr/payroll/deductions',
      permissions: [Permissions.ManageDeductions, Permissions.AdminAccess, Permissions.SuperAdminAccess],
    },
  ],
},
  {
    label: 'Documents',
    icon: 'description',
    permissions: [Permissions.UploadDocuments, Permissions.ApproveDocuments, Permissions.AdminAccess, Permissions.SuperAdminAccess],
    children: [
      {
        label: 'Upload Documents',
        route: '/hr/documents/upload',
      },
      {
        label: 'Approve Documents',
        route: '/hr/documents/approve',
      },
      {
        label: 'Archive Documents',
        route: '/hr/documents/archive',
      },
      {
        label: 'Delete Documents',
        route: '/hr/documents/delete',
      },
      {
        label: 'View Department Documents',
        route: '/hr/documents/department',
      },
    ],
  },
  {
    label: 'Departments',
    icon: 'business',
    permissions: [Permissions.CreateDepartment, Permissions.EditDepartment, Permissions.DeleteDepartment, Permissions.AssignDepartmentHead, Permissions.ManageDepartmentStructure, Permissions.AdminAccess, Permissions.SuperAdminAccess],
    children: [
      {
        label: 'Create Department',
        route: '/hr/departments/create',
      },
      {
        label: 'Edit Department',
        route: '/hr/departments/edit',
      },
      {
        label: 'Delete Department',
        route: '/hr/departments/delete',
      },
      {
        label: 'Assign Department Head',
        route: '/hr/departments/assign-head',
      },
      {
        label: 'Manage Department Structure',
        route: '/hr/departments/manage-structure',
      },
    ],
  },
  {
    label: 'Reports',
    icon: 'bar_chart',
    permissions: [Permissions.ViewHRReports, Permissions.GenerateDepartmentReports, Permissions.ExportData, Permissions.SuperAdminAccess],
    children: [
      {
        label: 'HR Reports',
        route: '/hr/reports/hr',
      },
      {
        label: 'Department Reports',
        route: '/hr/reports/department',
      },
      {
        label: 'Export Data',
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
