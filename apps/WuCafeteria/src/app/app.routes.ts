import { Route } from '@angular/router';
import { studentAuthGuard, vendorAuthGuard } from '@wucafeteria/CAuth';
import { VendorDashboardComponent } from './components/vendor-dashboard/vendor-dashboard.component';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'forbidden',
    loadComponent: () =>
      import('@wucafeteria/CAuth').then((m) => m.ForbiddenComponent),
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
    canActivate: [vendorAuthGuard],
    loadComponent: () =>
      import('./components/vendor-nav/vendor-nav.component').then(
        (m) => m.VendorNavComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './components/vendor-dashboard/vendor-dashboard.component'
          ).then((m) => m.VendorDashboardComponent),
      },
      {
        path: 'create-menu-item',
        loadComponent: () =>
          import(
            './components/create-menu-item/create-menu-item.component'
          ).then((m) => m.CreateMenuItemComponent),
      },
      {
        path: 'edit-menu-item/:id',
        loadComponent: () =>
          import('./components/edit-menu-item/edit-menu-item.component').then(
            (m) => m.EditMenuItemComponent
          ),
      },
      {
        path: 'my-menus',
        loadComponent: () =>
          import('./components/manage-menus/manage-menus.component').then(
            (m) => m.ManageMenusComponent
          ),
      },
      {
        path: 'vendor-orders',
        loadComponent: () =>
          import('./components/vendor-orders/vendor-orders.component').then(
            (m) => m.VendorOrdersComponent
          ),
      },
    ],
  },
  {
    path: 'student/dashboard',
    loadComponent: () =>
      import('./components/student-dashboard/student-dashboard.component').then(
        (s) => s.StudentDashboardComponent
      ),
    canActivate: [studentAuthGuard],
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
      {
        path: 'favorite-meals',
        loadComponent: () =>
          import('./components/favorite-meal/favorite-meal.component').then(
            (m) => m.FavoriteMealComponent
          ),
      },
    ],
  },
];
