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
];
