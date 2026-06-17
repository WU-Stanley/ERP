export interface DashboardLeaveRequestSummaryDto {
  id: string;
  employeeName: string;
  leaveTypeName: string;
  status: string;
  appliedAt: string;
  startDate: string;
  endDate: string;
  totalDays: number;
}

export interface HrDashboardSummaryDto {
  activeEmployees: number;
  departments: number;
  employmentTypes: number;
  leaveRequestsThisMonth: number;
  pendingApprovals: number;
  recentLeaveRequests: DashboardLeaveRequestSummaryDto[];
}

export interface LeaveDashboardSummaryDto {
  pending: number;
  approved: number;
  rejected: number;
  totalRequests: number;
  approvalQueueCount: number;
  recentLeaveRequests: DashboardLeaveRequestSummaryDto[];
}
