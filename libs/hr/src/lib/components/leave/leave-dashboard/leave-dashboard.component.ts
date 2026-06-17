import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LeaveDashboardSummaryDto } from '../../../dtos/dashboard.dto';
import { HrDashboardSummaryService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-leave-dashboard',
  templateUrl: './leave-dashboard.component.html',
  styleUrls: ['./leave-dashboard.component.css'],
  imports: [CommonModule, RouterModule],
})
export class LeaveDashboardComponent implements OnInit {
  isLoading = true;
  errorMessage = '';
  summary: LeaveDashboardSummaryDto | null = null;
  currentDate = new Date();

  quickActions = [
    { label: 'New Leave Request', route: '/hr/leave/requests', icon: 'add_circle', tone: 'bg-wigwe-green' },
    { label: 'Review Approvals', route: '/hr/leave/approval', icon: 'task_alt', tone: 'bg-wigwe-navy' },
    { label: 'Manage Leave Types', route: '/hr/leave/types', icon: 'category', tone: 'bg-indigo-600' },
    { label: 'Leave Policies', route: '/hr/leave/policies', icon: 'policy', tone: 'bg-amber-500' },
    { label: 'Reports', route: '/hr/leave/reports', icon: 'bar_chart', tone: 'bg-rose-600' },
  ];

  constructor(private dashboardService: HrDashboardSummaryService) {}

  ngOnInit() {
    this.dashboardService.getLeaveSummary().subscribe({
      next: (response) => {
        this.summary = response.data ?? null;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load leave dashboard metrics.';
        this.isLoading = false;
      },
    });
  }

  get metrics() {
    return [
      { label: 'Pending', value: this.summary?.pending ?? 0, icon: 'pending_actions', hint: 'Awaiting decision' },
      { label: 'Approved', value: this.summary?.approved ?? 0, icon: 'verified', hint: 'Accepted requests' },
      { label: 'Rejected', value: this.summary?.rejected ?? 0, icon: 'cancel', hint: 'Declined requests' },
      { label: 'Total Requests', value: this.summary?.totalRequests ?? 0, icon: 'event_note', hint: 'All leave requests' },
      { label: 'Approval Queue', value: this.summary?.approvalQueueCount ?? 0, icon: 'playlist_add_check', hint: 'Open approval steps' },
    ];
  }

  get approvalRate() {
    const total = this.summary?.totalRequests ?? 0;
    if (!total) return 0;
    return Math.round(((this.summary?.approved ?? 0) / total) * 100);
  }

  statusClass(status: string) {
    const normalized = status?.toLowerCase();
    if (normalized === 'approved') return 'bg-emerald-50 text-emerald-700';
    if (normalized === 'rejected') return 'bg-rose-50 text-rose-700';
    return 'bg-amber-50 text-amber-700';
  }
}
