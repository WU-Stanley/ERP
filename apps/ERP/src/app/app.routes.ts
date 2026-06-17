import { Route } from '@angular/router';
import { UnAuthorizedComponent } from './un-authorized/un-authorized.component';
import { PermissionGuard, Permissions } from '@erp/auth';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth/login',
    loadComponent: () => import('@erp/auth').then((m) => m.AuthComponent),
  },
  {
    path: 'auth/microsoft-callback',
    loadComponent: () => import('@erp/auth').then((m) => m.MicrosoftCallbackComponent),
  },
  { path: 'unauthorized', component: UnAuthorizedComponent },
  { path: 'payroll', redirectTo: 'hr/payroll/dashboard', pathMatch: 'full' },
  { path: 'inventory', redirectTo: 'procurement/inventory', pathMatch: 'full' },
  { path: 'assets', redirectTo: 'facilities/assets', pathMatch: 'full' },

  {
    path: 'finance',
    loadComponent: () => import('@erp/core').then((m) => m.ModuleLandingComponent),
    canActivate: [PermissionGuard],
    data: {
      permissions: [
        Permissions.AdminAccess,
        Permissions.ManagePayroll,
        Permissions.ProcessPayroll,
        Permissions.ViewPayslips,
        Permissions.SuperAdminAccess,
      ],
    },
  },
  {
    path: 'procurement',
    loadComponent: () => import('@erp/core').then((m) => m.ModuleLandingComponent),
    canActivate: [PermissionGuard],
    data: {
      permissions: [
        Permissions.AdminAccess,
        Permissions.ManageDepartmentStructure,
        Permissions.SuperAdminAccess,
      ],
    },
  },
  {
    path: 'procurement/:section',
    loadComponent: () => import('@erp/hr').then((m) => m.ProcurementInventoryWorkbenchComponent),
    canActivate: [PermissionGuard],
    data: {
      permissions: [
        Permissions.AdminAccess,
        Permissions.ApproveRequests,
        Permissions.ViewPendingApprovals,
        Permissions.SuperAdminAccess,
      ],
    },
  },
  {
    path: 'documents',
    loadComponent: () => import('@erp/core').then((m) => m.ModuleLandingComponent),
    canActivate: [PermissionGuard],
    data: {
      permissions: [
        Permissions.AdminAccess,
        Permissions.UploadDocuments,
        Permissions.ApproveDocuments,
        Permissions.ArchiveDocuments,
        Permissions.ViewDepartmentDocuments,
        Permissions.SuperAdminAccess,
      ],
    },
  },
  { path: 'helpdesk', redirectTo: 'hr/helpdesk', pathMatch: 'full' },
  { path: 'helpdesk/:section', redirectTo: 'hr/helpdesk/:section', pathMatch: 'full' },
  { path: 'helpdesk/:section/:action', redirectTo: 'hr/helpdesk/:section/:action', pathMatch: 'full' },
  {
    path: 'facilities',
    loadComponent: () => import('@erp/core').then((m) => m.ModuleLandingComponent),
    canActivate: [PermissionGuard],
    data: {
      permissions: [
        Permissions.AdminAccess,
        Permissions.ManageDepartmentStructure,
        Permissions.SuperAdminAccess,
      ],
    },
  },
  {
    path: 'facilities/:section',
    loadComponent: () => import('@erp/hr').then((m) => m.FacilitiesAssetsWorkbenchComponent),
    canActivate: [PermissionGuard],
    data: {
      permissions: [
        Permissions.AdminAccess,
        Permissions.ManageDepartmentStructure,
        Permissions.SuperAdminAccess,
      ],
    },
  },
  {
    path: 'registry',
    loadComponent: () => import('@erp/core').then((m) => m.ModuleLandingComponent),
    canActivate: [PermissionGuard],
    data: {
      permissions: [
        Permissions.AdminAccess,
        Permissions.AccessDashboard,
        Permissions.SuperAdminAccess,
      ],
    },
  },
  {
    path: 'registry/:section',
    loadComponent: () => import('@erp/hr').then((m) => m.RegistryIntegrationWorkbenchComponent),
    canActivate: [PermissionGuard],
    data: {
      permissions: [
        Permissions.AdminAccess,
        Permissions.AccessDashboard,
        Permissions.SuperAdminAccess,
      ],
    },
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () => import('@erp/auth').then((m) => m.ForgotPasswordComponent),
  },
  {
    path: 'auth/reset-password',
    loadComponent: () => import('@erp/auth').then((m) => m.ResetPasswordComponent),
  },
  {
    path: 'references',
    loadComponent: () => import('@erp/auth').then((m) => m.AuthDashboardComponent),
    children: [
      {
        path: 'roles',
        loadComponent: () => import('@erp/auth').then((m) => m.RoleListComponent),
      },
      {
        path: 'user-types',
        loadComponent: () => import('@erp/auth').then((m) => m.UserTypeComponent),
      },
      {
        path: 'employment-types',
        loadComponent: () => import('@erp/auth').then((m) => m.EmploymentTypeComponent),
      },
      {
        path: 'departments',
        loadComponent: () => import('@erp/auth').then((a) => a.DepartmentComponent),
      },
    ],
  },
  {
    path: 'auth',
    loadComponent: () => import('@erp/auth').then((m) => m.AuthDashboardComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('@erp/auth').then((m) => m.AuthHomeComponent),
      },
      {
        path: 'change-password',
        loadComponent: () => import('@erp/auth').then((m) => m.ChangePasswordComponent),
      },
      {
        path: 'add-staff',
        canActivate: [() => import('@erp/auth').then((m) => m.PermissionGuard)],
        data: { permission: ['CreateUser', 'SuperAdminaccess', 'AdminAccess'] },
        loadComponent: () => import('@erp/auth').then((m) => m.AddStaffComponent),
      },
      {
        path: 'mroles',
        loadComponent: () => import('@erp/auth').then((m) => m.ManageRoleComponent),
      },
      {
        path: 'manage-staff-role',
        loadComponent: () => import('@erp/auth').then((m) => m.ManageStaffRoleComponent),
      },
      {
        path: 'manage-staff-permission',
        loadComponent: () => import('@erp/auth').then((m) => m.ManageStaffPermissionComponent),
      },
      {
        path: 'audit-logs',
        loadComponent: () => import('@erp/auth').then((m) => m.AuditLogsComponent),
        canActivate: [PermissionGuard],
        data: {
          permissions: [
            Permissions.AdminAccess,
            Permissions.ViewAuditLogs,
            Permissions.SuperAdminAccess,
          ],
        },
      },
    ],
  },
  {
    path: 'hr',
    loadComponent: () => import('@erp/hr').then((m) => m.HrDashboardComponent),
    children: [
      {
        path: 'profile',
        loadComponent: () => import('@erp/hr').then((m) => m.EmployeeSelfServiceProfileComponent),
      },
      {
        path: 'dashboard',
        loadComponent: () => import('@erp/hr').then((m) => m.HrHomeComponent),
      },
      {
        path: 'leave',
        loadComponent: () => import('@erp/hr').then((m) => m.LeaveDashboardComponent),
      },
      {
        path: 'leave/requests',
        loadComponent: () => import('@erp/hr').then((m) => m.LeaveRequestComponent),
      },
      {
        path: 'leave/types',
        loadComponent: () => import('@erp/hr').then((m) => m.LeaveTypeComponent),
      },
      {
        path: 'leave/policies',
        loadComponent: () => import('@erp/hr').then((m) => m.LeavePoliciesComponent),
        canActivate: [PermissionGuard],
        data: {
          permissions: [
            Permissions.AdminAccess,
            Permissions.ManageLeave,
            Permissions.ManageLeaveRequests,
          ],
        },
      },
      {
        path: 'leave/approval',
        loadComponent: () => import('@erp/hr').then((m) => m.LeaveApprovalComponent),
        canActivate: [PermissionGuard],
        data: {
          permissions: [
            Permissions.AdminAccess,
            Permissions.ManageLeave,
            Permissions.RejectLeave,
            Permissions.ApproveLeave,
            Permissions.ManageLeaveRequests,
          ],
        },
      },
      {
        path: 'leave/reports',
        loadComponent: () => import('@erp/hr').then((m) => m.LeaveReportsComponent),
        canActivate: [PermissionGuard],
        data: {
          permissions: [
            Permissions.AdminAccess,
            Permissions.ManageLeave,
            Permissions.ManageLeaveRequests,
          ],
        },
      },
      {
        path: 'leave/approval-workflow',
        loadComponent: () => import('@erp/hr').then((m) => m.ApprovalWorkflowComponent),
        canActivate: [PermissionGuard],
        data: {
          permissions: [
            Permissions.CreateDepartment,
            Permissions.EditDepartment,
            Permissions.ManageDepartmentStructure,
            Permissions.AdminAccess,
            Permissions.SuperAdminAccess,
          ],
        },
      },
      {
        path: 'helpdesk',
        loadComponent: () => import('@erp/hr').then((m) => m.HelpdeskWorkbenchComponent),
      },
      {
        path: 'helpdesk/:section',
        loadComponent: () => import('@erp/hr').then((m) => m.HelpdeskWorkbenchComponent),
      },
      {
        path: 'helpdesk/:section/:action',
        loadComponent: () => import('@erp/hr').then((m) => m.HelpdeskWorkbenchComponent),
      },
      {
        path: 'employees',
        loadComponent: () => import('@erp/hr').then((m) => m.EmployeeDirectoryComponent),
        canActivate: [PermissionGuard],
        data: {
          permissions: [
            Permissions.AdminAccess,
            Permissions.ViewEmployeeProfiles,
            Permissions.ViewDepartmentEmployeeProfiles,
            Permissions.ManageUsers,
            Permissions.SuperAdminAccess,
          ],
        },
      },
      { path: 'employees/dashboard', redirectTo: 'employees', pathMatch: 'full' },
      { path: 'employees/profiles', redirectTo: 'employees', pathMatch: 'full' },
      {
        path: 'employees/department-profiles',
        redirectTo: 'employees',
        pathMatch: 'full',
      },
      {
        path: 'employees/onboarding',
        loadComponent: () => import('@erp/auth').then((m) => m.AddStaffComponent),
        canActivate: [PermissionGuard],
        data: {
          permissions: [
            Permissions.AdminAccess,
            Permissions.CreateUser,
            Permissions.ManageUsers,
            Permissions.SuperAdminAccess,
          ],
        },
      },
      {
        path: 'employees/bulk-upload',
        loadComponent: () => import('@erp/hr').then((m) => m.BulkStaffUploadComponent),
        canActivate: [PermissionGuard],
        data: {
          permissions: [
            Permissions.AdminAccess,
            Permissions.CreateUser,
            Permissions.ManageUsers,
            Permissions.SuperAdminAccess,
          ],
        },
      },
      {
        path: 'employees/profile-updates',
        loadComponent: () => import('@erp/hr').then((m) => m.ProfileUpdateReviewComponent),
        canActivate: [PermissionGuard],
        data: {
          permissions: [
            Permissions.AdminAccess,
            Permissions.ApproveProfileUpdateInDepartment,
            Permissions.UpdateEmployeeProfiles,
            Permissions.ManageUsers,
            Permissions.SuperAdminAccess,
          ],
        },
      },
      {
        path: 'employees/:id/edit',
        loadComponent: () => import('@erp/hr').then((m) => m.EmployeeEditComponent),
        canActivate: [PermissionGuard],
        data: {
          permissions: [
            Permissions.AdminAccess,
            Permissions.ManageUsers,
            Permissions.UpdateEmployeeProfiles,
            Permissions.SuperAdminAccess,
          ],
        },
      },
      {
        path: 'employees/:id/employment',
        loadComponent: () => import('@erp/hr').then((m) => m.EmploymentAssignmentComponent),
        canActivate: [PermissionGuard],
        data: {
          permissions: [
            Permissions.AdminAccess,
            Permissions.ManageUsers,
            Permissions.UpdateEmployeeProfiles,
            Permissions.AssignSupervisor,
            Permissions.SuperAdminAccess,
          ],
        },
      },
      {
        path: 'employees/:id',
        loadComponent: () => import('@erp/hr').then((m) => m.EmployeeDetailComponent),
        canActivate: [PermissionGuard],
        data: {
          permissions: [
            Permissions.AdminAccess,
            Permissions.ViewEmployeeProfiles,
            Permissions.ViewDepartmentEmployeeProfiles,
            Permissions.ManageUsers,
            Permissions.SuperAdminAccess,
          ],
        },
      },
      {
        path: 'departments',
        loadComponent: () => import('@erp/auth').then((c) => c.DepartmentComponent),
        canActivate: [PermissionGuard],
        data: {
          permissions: [
            Permissions.AdminAccess,
            Permissions.ManageUsers,
            Permissions.SuperAdminAccess,
          ],
        },
      },
      {
        path: 'departments/:id/employees',
        loadComponent: () => import('@erp/hr').then((m) => m.DepartmentStaffComponent),
        canActivate: [PermissionGuard],
        data: {
          permissions: [
            Permissions.AdminAccess,
            Permissions.ViewEmployeeProfiles,
            Permissions.ViewDepartmentEmployeeProfiles,
            Permissions.ManageUsers,
            Permissions.SuperAdminAccess,
          ],
        },
      },
      {
        path: 'payroll/dashboard',
        loadComponent: () => import('@erp/hr').then((m) => m.FinancePayrollWorkbenchComponent),
        canActivate: [PermissionGuard],
        data: {
          permissions: [
            Permissions.AdminAccess,
            Permissions.ManagePayroll,
            Permissions.ProcessPayroll,
            Permissions.ViewPayslips,
            Permissions.SuperAdminAccess,
          ],
        },
      },
      {
        path: 'payroll/:section',
        loadComponent: () => import('@erp/hr').then((m) => m.FinancePayrollWorkbenchComponent),
        canActivate: [PermissionGuard],
        data: {
          permissions: [
            Permissions.AdminAccess,
            Permissions.ManagePayroll,
            Permissions.ProcessPayroll,
            Permissions.ViewPayslips,
            Permissions.UpdateSalaryStructure,
            Permissions.ManageBonuses,
            Permissions.ManageDeductions,
            Permissions.SuperAdminAccess,
          ],
        },
      },
      {
        path: 'documents/:section',
        loadComponent: () => import('@erp/hr').then((m) => m.DocumentManagementWorkbenchComponent),
        canActivate: [PermissionGuard],
        data: {
          permissions: [
            Permissions.AdminAccess,
            Permissions.UploadDocuments,
            Permissions.ApproveDocuments,
            Permissions.ArchiveDocuments,
            Permissions.DeleteDocuments,
            Permissions.ViewDepartmentDocuments,
            Permissions.SuperAdminAccess,
          ],
        },
      },
  {
    path: 'recruitment',
    loadComponent: () => import('@erp/hr').then((m) => m.RecruitmentDashboardComponent),
    canActivate: [PermissionGuard],
    data: {
      permissions: [
        Permissions.AdminAccess,
        Permissions.SuperAdminAccess,
      ],
    },
  },
  {
    path: 'recruitment/job-postings',
    loadComponent: () => import('@erp/hr').then((m) => m.RecruitmentJobPostingsComponent),
    canActivate: [PermissionGuard],
    data: {
      permissions: [
        Permissions.AdminAccess,
        Permissions.SuperAdminAccess,
      ],
    },
  },
  {
    path: 'recruitment/job-postings/new',
    loadComponent: () => import('@erp/hr').then((m) => m.RecruitmentJobPostingsComponent),
    canActivate: [PermissionGuard],
    data: {
      permissions: [
        Permissions.AdminAccess,
        Permissions.SuperAdminAccess,
      ],
    },
  },
  {
    path: 'recruitment/applications',
    loadComponent: () => import('@erp/hr').then((m) => m.RecruitmentApplicationsComponent),
    canActivate: [PermissionGuard],
    data: {
      permissions: [
        Permissions.AdminAccess,
        Permissions.SuperAdminAccess,
      ],
    },
  },
  {
    path: 'recruitment/applications/:id',
    loadComponent: () => import('@erp/hr').then((m) => m.RecruitmentApplicationDetailComponent),
    canActivate: [PermissionGuard],
    data: {
      permissions: [
        Permissions.AdminAccess,
        Permissions.SuperAdminAccess,
      ],
    },
  },
  ],
},
{
  path: 'careers',
  loadComponent: () => import('@erp/hr').then((m) => m.PublicJobListingsComponent),
},
{
  path: 'careers/jobs/:id',
  loadComponent: () => import('@erp/hr').then((m) => m.PublicJobDetailComponent),
},
{
  path: 'careers/track',
  loadComponent: () => import('@erp/hr').then((m) => m.ApplicantTrackingComponent),
},
{
  path: 'careers/teams',
  loadComponent: () => import('@erp/hr').then((m) => m.PublicTeamsComponent),
}
];
