import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../auth.service';
import { HasAnyPermissionDirective } from '../directives/has-permissions.directive';
import { Permissions } from '../enums/permissions.enum';

@Component({
  selector: 'lib-auth-dashboard',
  templateUrl: './auth-dashboard.component.html',
  styleUrls: ['./auth-dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule,
    HasAnyPermissionDirective,
  ],
})
export class AuthDashboardComponent implements OnInit {
  isCollapsed = false;
  Permissions = Permissions
  user = (() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  })();
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    if (this.user.isDefault) {
      this.router.navigate(['auth/change-password']);
    }
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
