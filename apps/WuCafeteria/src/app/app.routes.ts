import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'auth/student',
    loadComponent: () =>
      import('@wucafeteria/CAuth').then((m) => m.StudentLoginComponent),
  },
  {
    path: 'auth/vendor',
    loadComponent: () =>
      import('@wucafeteria/CAuth').then((m) => m.VendorAuthComponent),
  },
  {
    path: 'vendor/dashboard',
    loadComponent: () =>
      import('./components/vendor-dashboard/vendor-dashboard.component').then(
        (m) => m.VendorDashboardComponent
      ),
  },
  {
    path: 'student/dashboard',
    loadComponent: () =>
      import('./components/student-dashboard/student-dashboard.component').then(
        (s) => s.StudentDashboardComponent
      ),
  },
];
