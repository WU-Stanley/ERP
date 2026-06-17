import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HrDashboardSummaryDto } from '../../dtos/dashboard.dto';
import { HrDashboardSummaryService } from '../../services/dashboard.service';

@Component({
  selector: 'lib-hr-home',
  templateUrl: './hr-home.component.html',
  styleUrls: ['./hr-home.component.css'],
  imports: [CommonModule, RouterModule],
})
export class HrHomeComponent implements OnInit {
  isLoading = true;
  errorMessage = '';
  summary: HrDashboardSummaryDto | null = null;
  currentDate = new Date();
  user = (() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  })();

  quickActions = [
    { label: 'Employee Directory', route: '/hr/employees', icon: 'badge', tone: 'bg-emerald-600' },
    { label: 'Leave Requests', route: '/hr/leave/requests', icon: 'event_note', tone: 'bg-wigwe-green' },
    { label: 'Departments', route: '/hr/departments', icon: 'business', tone: 'bg-wigwe-navy' },
    { label: 'Bulk Staff Upload', route: '/hr/employees/bulk-upload', icon: 'upload_file', tone: 'bg-indigo-600' },
    { label: 'Leave Approval', route: '/hr/leave/approval', icon: 'task_alt', tone: 'bg-amber-500' },
    { label: 'Leave Reports', route: '/hr/leave/reports', icon: 'bar_chart', tone: 'bg-rose-600' },
  ];

  constructor(private dashboardService: HrDashboardSummaryService) {}

  ngOnInit() {
    this.dashboardService.getHrSummary().subscribe({
      next: (response) => {
        this.summary = response.data ?? null;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load HR dashboard metrics.';
        this.isLoading = false;
      },
    });
  }

  get metrics() {
    return [
      { label: 'Active Employees', value: this.summary?.activeEmployees ?? 0, icon: 'groups', hint: 'Currently active staff' },
      { label: 'Departments', value: this.summary?.departments ?? 0, icon: 'business', hint: 'Organisation units' },
      { label: 'Employment Types', value: this.summary?.employmentTypes ?? 0, icon: 'work', hint: 'Configured classifications' },
      { label: 'Requests This Month', value: this.summary?.leaveRequestsThisMonth ?? 0, icon: 'calendar_month', hint: 'New leave requests' },
      { label: 'Pending Approvals', value: this.summary?.pendingApprovals ?? 0, icon: 'pending_actions', hint: 'Waiting for action' },
    ];
  }

  statusClass(status: string) {
    const normalized = status?.toLowerCase();
    if (normalized === 'approved') return 'bg-emerald-50 text-emerald-700';
    if (normalized === 'rejected') return 'bg-rose-50 text-rose-700';
    return 'bg-amber-50 text-amber-700';
  }
}
