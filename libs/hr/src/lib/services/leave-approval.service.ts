import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';

@Injectable()
export class LeaveApprovalService {
  private http = inject(HttpClient);
  private env = inject<AppEnvironment>(ENVIRONMENT);

  constructor() {}

  getLeaveApprovals() {
    return this.http.get(`${this.env.apiUrl}/leave-approvals`);
  }

  getLeaveApprovalByApprovalPersonId(approvalPersonId: string) {
    return this.http.get(
      `${this.env.apiUrl}/leave-approvals/${approvalPersonId}`
    );
  }

  getLeaveApprovalByDelegationId(delegationId: string) {
    return this.http.get(
      `${this.env.apiUrl}/leave-approvals/delegation/${delegationId}`
    );
  }

  getLeaveApprovalByApprovalFlowIdAndApprovalPersonId(
    approvalFlowId: string,
    approvalPersonId: string
  ) {
    return this.http.get(
      `${this.env.apiUrl}/leave-approvals/flow/${approvalFlowId}/person/${approvalPersonId}`
    );
  }

  getByStepOrderAndApprovalFlowIdAsync(
    stepOrder: number,
    approvalFlowId: string
  ) {
    return this.http.get(
      `${this.env.apiUrl}/leave-approvals/flow/${approvalFlowId}/step/${stepOrder}`
    );
  }
}
