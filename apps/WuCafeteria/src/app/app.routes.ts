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
    children: [
      {
        path: 'menu',
        loadComponent: () =>
          import('./components/menu-items/Menu-Items.component').then(
            (m) => m.MenuItemsComponent
          ),
      },
      {
        path: 'menu/:id',
        loadComponent: () =>
          import(
            './components/Menu-Item-detail/Menu-Item-detail.component'
          ).then((m) => m.MenuItemDetailComponent),
      },
      {
        path: 'order-history',
        loadComponent: () =>
          import('./components/order-history/order-history.component').then(
            (m) => m.OrderHistoryComponent
          ),
      },
    ],
  },
];
