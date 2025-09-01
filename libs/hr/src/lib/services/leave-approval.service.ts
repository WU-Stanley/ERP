import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@erp/auth';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';
import { ApprovalDelegationDto, LeaveRequestApproval } from '../dtos';

@Injectable({ providedIn: 'root' })
export class LeaveApprovalService {
  private http = inject(HttpClient);
  private env = inject<AppEnvironment>(ENVIRONMENT);

  constructor() {
    //
  }
  delegateApprover(form: ApprovalDelegationDto) {
    return this.http.post<ApiResponse<ApprovalDelegationDto>>(
      `${this.env.apiUrl}/LeaveApprovals/delegate-approval`,
      form
    );
  }
  getAllPendingLeaveRequestApprovals() {
    return this.http.get<ApiResponse<LeaveRequestApproval[]>>(
      `${this.env.apiUrl}/LeaveApprovals/get-all-pending`
    );
  }
  getAllLeaveRequestApprovals() {
    return this.http.get<ApiResponse<LeaveRequestApproval[]>>(
      `${this.env.apiUrl}/LeaveApprovals/get-all`
    );
  }
  getLeaveApprovalsByRequestId(requestId: string) {
    return this.http.get<ApiResponse<LeaveRequestApproval[]>>(
      `${this.env.apiUrl}/LeaveApprovals/get-by-request/${requestId}`
    );
  }

  getLeaveApprovalByApprovalPersonId(approvalPersonId: string) {
    return this.http.get<ApiResponse<LeaveRequestApproval[]>>(
      `${this.env.apiUrl}/LeaveApprovals/get-by-approver-person/${approvalPersonId}`
    );
  }

  getLeaveApprovalByDelegationId(delegationId: string) {
    return this.http.get<ApiResponse<LeaveRequestApproval[]>>(
      `${this.env.apiUrl}/LeaveApprovals/get-by-approver-delegation/${delegationId}`
    );
  }

  getLeaveApprovalByApprovalFlowIdAndApprovalPersonId(
    approvalFlowId: string,
    approvalPersonId: string
  ) {
    return this.http.get<ApiResponse<LeaveRequestApproval[]>>(
      `${this.env.apiUrl}/LeaveApprovals/get-by-approval-flow-and-person/${approvalFlowId}/${approvalPersonId}`
    );
  }

  getByStepOrderAndApprovalFlowIdAsync(
    stepOrder: number,
    approvalFlowId: string
  ) {
    return this.http.get<ApiResponse<LeaveRequestApproval>>(
      `${this.env.apiUrl}/LeaveApprovals/get-by-approval-flow-and-step/${approvalFlowId}/${stepOrder}`
    );
  }
  approveRejectLeaveRequest(
    leaveRequestId: string,
    body: { approvalId: string; comment: string; isApproved: boolean }
  ) {
    return this.http.post<ApiResponse<LeaveRequestApproval>>(
      `${this.env.apiUrl}/LeaveApprovals/approve-reject-leave/${leaveRequestId}`,
      body
    );
  }
}
