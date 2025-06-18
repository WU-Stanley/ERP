import { Route } from '@angular/router';
import { AddStaffComponent, AuthComponent, AuthDashboardComponent, ChangePasswordComponent, ForgotPasswordComponent } from '@erp/auth'; // Adjust the import path as necessary

export const appRoutes: Route[] = [
    {path: '', redirectTo: 'auth/login', pathMatch: 'full'},
     { path: 'auth/login', component: AuthComponent },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },

  // Protected area under layout
  {
    path: 'auth',
    component: AuthDashboardComponent,
    children: [
      { path: 'dashboard', component: AuthComponent }, // replace with actual DashboardComponent
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'add-staff', component: AddStaffComponent },
    ]
  }]
