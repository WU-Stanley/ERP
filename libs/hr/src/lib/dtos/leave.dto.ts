import { EmploymentTypeDto, UserDto } from '@erp/auth';

export interface LeaveRequestCreateDto {
  leaveTypeId: string; // Guid
  startDate: Date;
  endDate: Date;
  reason: string;
}

export interface ApprovalDecisionDto {
  isApproved: boolean;
  comment: string;
}

export interface CreateLeaveTypeDto {
  name: string; // e.g., Annual Leave
  maxDays: number;
  isPaid: boolean;
  description?: string;
  isActive: boolean;
  approvalFlowId: string;
  visibilityJson?: string;
  id?: string;
}

export interface CreateApprovalFlowDto {
  id?: string;
  name: string;
  isActive: boolean;
  createdBy: string; // Guid
  createdAt: Date;
  steps?: ApprovalStep[]; // You need to define this interface separately
  visibilityJson?: string;
}

export interface PublicHolidayDto {
  date: Date;
  name: string;
  isRecurring: boolean; // e.g. New Year’s Day every Jan 1st
  description?: string;
  createdAt: Date;
}

export interface ApprovalDelegationDto {
  id?: string;
  approverPersonId?: string;
  delegatePersonId: string;
  approvalFlowId?: string;
  approvalStepId?: string;
  startDate: Date;
  endDate: Date;
  notes?: string;
  isActive: boolean; // Must be calculated on frontend or fetched from backend
}
export interface LeaveTypeDto {
  id: string; // Guid
  name: string; // e.g., "Annual Leave"
  maxDays: number;
  isPaid: boolean;
  gender?: string;
  description?: string;
  isActive: boolean;
  requireDocument?: boolean;
  approvalFlowId: string;
  approvalFlow: ApprovalFlowDto;
  colorTag: string;
  visibilityRules: LeaveTypeVisibilityDto[]; // assuming LeaveTypeVisibility interface exists
}
export interface ApprovalFlowDto {
  id?: string;
  name: string;
  isActive: boolean;
  createdBy: string; // Guid
  createdAt: Date;
  visibilityJson?: string; // Optional: if approval flow has visibility scope
  steps?: ApprovalStep[]; // Optional: array of ApprovalStep
}

export interface LeaveTypeVisibilityDto {
  id: string; // Guid
  leaveTypeId: string; // Guid
  visibilityType: string; // "ROLE", "DEPARTMENT", "EMPLOYMENT_TYPE", USER_TYPE
  value: string; // e.g., "Academic", "HR", "FullTime"
  leaveType?: LeaveTypeDto; // optional relationship
}

export interface LeavePolicyDto {
  leaveTypeId: any;
  employmentTypeId?: string; // e.g., "FullTime", "Contract"
  roleName?: string; // Optional: if some roles have custom entitlement
  annualEntitlement: number;
  isAccrualBased: boolean;
  accrualRatePerMonth: number;
  maxCarryOverDays: number;
  allowNegativeBalance: boolean;
  createdAt: Date;
  updatedAt?: Date;
  id?: string; // Guid
  leaveType?: LeaveTypeDto;
  employmentType?: EmploymentTypeDto; // e.g., "FullTime", "Contract"
}

export interface ApprovalStep {
  id?: string; // Guid
  approvalFlowId: string; // Guid
  stepName: string; // e.g. "Manager Approval"
  stepOrder: number; // Step number
  approverType: string; // MANAGER, ROLE, USER
  approverValue: string; // Role name, UserId, etc.
  conditionJson: string; // Optional dynamic conditions (JSON)
}
export interface LeaveBalanceDto {
  leaveTypeId: string; // Guid
  personId: string; // Guid
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  year: number; // e.g., 2023
}

export interface LeaveRequestDto {
  totalDays: number;
  userId: string;
  leaveTypeId: string;
  startDate: Date;
  endDate: Date;
  supportDocument?: string;
  reason: string;
  status: string; // Pending, Approved, Rejected
  appliedAt: Date;

  leaveType?: LeaveTypeDto;
  user?: UserDto;

  id?: string;
}

export interface LeaveRequestApproval {
  id: string;
  leaveRequestId: string;
  approvalStepId: string;
  approverPersonId: string;
  status: string;
  actedByUserId: string | null;
  comment: string | null;
  decisionAt: Date | null;
  leaveRequest: LeaveRequestDto | null;
  approvalStep: ApprovalStep | null;
  approverPerson: UserDto | null;
}

//
