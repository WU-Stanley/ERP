export interface DashboardStaffSummaryDto {
  id: string;
  fullName: string;
  email: string;
  dateCreated: string;
}

export interface AdminDashboardSummaryDto {
  staffCount: number;
  rolesCount: number;
  departmentsCount: number;
  userTypesCount: number;
  employmentTypesCount: number;
  recentlyCreatedStaff: DashboardStaffSummaryDto[];
}
