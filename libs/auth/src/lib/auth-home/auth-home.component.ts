import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { AdminDashboardSummaryDto } from '../dtos/dashboard.dto';

@Component({
  selector: 'app-auth-home',
  templateUrl: './auth-home.component.html',
  styleUrls: ['./auth-home.component.css'],
  imports: [CommonModule, RouterModule, DatePipe],
})
export class AuthHomeComponent implements OnInit {
  isLoading = true;
  errorMessage = '';
  summary: AdminDashboardSummaryDto | null = null;
  currentDate = new Date();
  user = (() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  })();

  quickActions = [
    { label: 'Create Staff', route: '/auth/add-staff', icon: 'person_add', tone: 'bg-wigwe-green' },
    { label: 'Manage Roles', route: '/auth/mroles', icon: 'admin_panel_settings', tone: 'bg-wigwe-navy' },
    { label: 'Staff Permissions', route: '/auth/manage-staff-permission', icon: 'rule', tone: 'bg-indigo-600' },
    { label: 'Departments', route: '/references/departments', icon: 'business', tone: 'bg-amber-500' },
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getAdminSummary().subscribe({
      next: (response) => {
        this.summary = response.data ?? null;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load admin dashboard metrics.';
        this.isLoading = false;
      },
    });
  }

  get metrics() {
    return [
      { label: 'Staff', value: this.summary?.staffCount ?? 0, icon: 'groups', hint: 'Registered staff users' },
      { label: 'Roles', value: this.summary?.rolesCount ?? 0, icon: 'admin_panel_settings', hint: 'Access roles configured' },
      { label: 'Departments', value: this.summary?.departmentsCount ?? 0, icon: 'business', hint: 'Academic and non-academic' },
      { label: 'User Types', value: this.summary?.userTypesCount ?? 0, icon: 'badge', hint: 'Identity categories' },
      { label: 'Employment Types', value: this.summary?.employmentTypesCount ?? 0, icon: 'work', hint: 'Employment classes' },
    ];
  }
}
