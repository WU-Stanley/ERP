import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';
import { ApprovalDecisionDto, CreateApprovalFlowDto } from '../dtos/leave.dto';
import { ApiResponse } from '@erp/auth';

@Injectable({
  providedIn: 'root',
})
export class ApprovalWorkflowService {
  private http = inject(HttpClient);
  private env = inject<AppEnvironment>(ENVIRONMENT);

  constructor() {}

  createApprovalWorkflow(data: CreateApprovalFlowDto) {
    return this.http.post<ApiResponse<CreateApprovalFlowDto>>(
      `${this.env.apiUrl}/approvalflow/create`,
      data,
      { withCredentials: true }
    );
  }
  updateApprovalWorkflow(id: string, data: CreateApprovalFlowDto) {
    return this.http.put<ApiResponse<CreateApprovalFlowDto>>(
      `${this.env.apiUrl}/approvalflow/update/${id}`,
      data,
      { withCredentials: true }
    );
  }
  getApprovalWorkflow(id: string) {
    return this.http.get<CreateApprovalFlowDto>(
      `${this.env.apiUrl}/approvalflow/${id}`,
      { withCredentials: true }
    );
  }
  getApprovalWorkflows() {
    return this.http.get<ApiResponse<CreateApprovalFlowDto[]>>(
      `${this.env.apiUrl}/approvalflow/all`,
      { withCredentials: true }
    );
  }
  deleteApprovalWorkflow(id: string) {
    return this.http.delete(`${this.env.apiUrl}/approvalflow/delete/${id}`, {
      withCredentials: true,
    });
  }
}
