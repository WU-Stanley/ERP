import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@erp/auth';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';
import { LeaveRequestApproval } from '../dtos';

@Injectable()
export class LeaveApprovalService {
  private http = inject(HttpClient);
  private env = inject<AppEnvironment>(ENVIRONMENT);

  constructor() {
    //
  }

  getLeaveApprovals() {
    return this.http.get<ApiResponse<LeaveRequestApproval[]>>(
      `${this.env.apiUrl}/LeaveApprovals`
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
    return this.http.get(
      `${this.env.apiUrl}/LeaveApprovals/get-by-approval-flow-and-step/${approvalFlowId}/${stepOrder}`
    );
  }
  approveRejectLeaveRequest(leaveRequestId: string, isApproved: boolean) {
    return this.http.post<ApiResponse<LeaveRequestApproval>>(
      `${this.env.apiUrl}/LeaveApprovals/approve-reject/${leaveRequestId}`,
      { isApproved }
    );
  }
}
