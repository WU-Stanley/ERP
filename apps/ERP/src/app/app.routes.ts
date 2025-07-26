import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth/login',

    loadComponent: () => import('@erp/auth').then((m) => m.AuthComponent),
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () =>
      import('@erp/auth').then((m) => m.ForgotPasswordComponent),
  },
  {
    path: 'references',
    loadComponent: () =>
      import('@erp/auth').then((m) => m.AuthDashboardComponent),
    children: [
      // {path: 'departments', loadComponent: () => import('@erp/department').then(m => m.DepartmentsComponent)},
      {
        path: 'roles',
        loadComponent: () =>
          import('@erp/auth').then((m) => m.RoleListComponent),
      },
      {
        path: 'user-types',
        loadComponent: () =>
          import('@erp/auth').then((m) => m.UserTypeComponent),
      },
      {
        path: 'employment-types',
        loadComponent: () =>
          import('@erp/auth').then((m) => m.EmploymentTypeComponent),
      },
      {
        path: 'departments',
        loadComponent: () =>
          import('@erp/auth').then((a) => a.DepartmentComponent),
      },
    ],
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('@erp/auth').then((m) => m.AuthDashboardComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@erp/auth').then((m) => m.AuthHomeComponent),
      },
      {
        path: 'change-password',
        loadComponent: () =>
          import('@erp/auth').then((m) => m.ChangePasswordComponent),
      },
      {
        path: 'add-staff',
        canActivate: [() => import('@erp/auth').then((m) => m.PermissionGuard)],
        data: { permission: ['CreateUser', 'SuperAdminaccess', 'AdminAccess'] },
        loadComponent: () =>
          import('@erp/auth').then((m) => m.AddStaffComponent),
      },
      {
        path: 'mroles',
        loadComponent: () =>
          import('@erp/auth').then((m) => m.ManageRoleComponent),
      },
      {
        path: 'manage-staff-role',
        loadComponent: () =>
          import('@erp/auth').then((m) => m.ManageStaffRoleComponent),
      },
      {
        path: 'manage-staff-permission',
        loadComponent: () =>
          import('@erp/auth').then((m) => m.ManageStaffPermissionComponent),
      },
    ],
  },
  {
    path: 'hr',
    loadComponent: () => import('@erp/hr').then((m) => m.HrDashboardComponent),
    children: [
      { path: 'dashboard', loadComponent: () => import('@erp/hr').then(m => m.HrHomeComponent) },
      { path: 'leave', loadComponent: () => import('@erp/hr').then(m => m.LeaveDashboardComponent) },
      { path: 'leave/requests', loadComponent: () => import('@erp/hr').then(m => m.LeaveRequestComponent) },
      { path: 'leave/types', loadComponent: () => import('@erp/hr').then(m => m.LeaveTypeComponent) },
      { path: 'leave/policies', loadComponent: () => import('@erp/hr').then(m => m.LeavePoliciesComponent) },
      { path: 'leave/approval', loadComponent: () => import('@erp/hr').then(m => m.LeaveApprovalComponent) },
      { path: 'leave/reports', loadComponent: () => import('@erp/hr').then(m => m.LeaveReportsComponent) },
      { path: 'leave/approval-workflow', loadComponent: () => import('@erp/hr').then(m => m.ApprovalWorkflowComponent) },
    ]
  }
];
