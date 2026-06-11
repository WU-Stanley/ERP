import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@erp/auth';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';
import { LeavePolicyDto } from '../dtos/leave.dto';

@Injectable({ providedIn: 'root' })
export class LeavePolicyService {
  private http = inject(HttpClient);
  private env = inject<AppEnvironment>(ENVIRONMENT);

  constructor() {
    //
  }
  deleteLeavePolicy(id: string) {
    return this.http.delete<ApiResponse<unknown>>(
      this.env.apiUrl + '/leavePolicy/' + id
    );
  }
  getLeavePolicys() {
    return this.http.get<ApiResponse<LeavePolicyDto[]>>(
      this.env.apiUrl + '/leavePolicy/'
    );
  }
  createLeavePolicy(data: LeavePolicyDto) {
    return this.http.post<ApiResponse<LeavePolicyDto>>(
      this.env.apiUrl + '/leavePolicy/',
      data
    );
  }
  updateLeavePolicy(data: LeavePolicyDto) {
    return this.http.put<ApiResponse<LeavePolicyDto>>(
      this.env.apiUrl + '/leavePolicy/update/' + data.id,
      data
    );
  }
}
