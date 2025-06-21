import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('@erp/auth').then(m => m.AuthComponent)
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () =>
      import('@erp/auth').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('@erp/auth').then(m => m.AuthDashboardComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@erp/auth').then(m => m.AuthHomeComponent) // Make sure AuthHomeComponent exists
      },
      {
        path: 'change-password',
        loadComponent: () =>
          import('@erp/auth').then(m => m.ChangePasswordComponent)
      },
      {
        path: 'add-staff',
        loadComponent: () =>
          import('@erp/auth').then(m => m.AddStaffComponent)
      },
      {
        path: 'mrole',
        loadComponent: () =>
          import('@erp/auth').then(m => m.MangeRoleComponent)
      },
      {
        path: 'mpermission',
        loadComponent: () =>
          import('@erp/auth').then(m => m.MangePermissionComponent)
      }
    ],
  },
];
