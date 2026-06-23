import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@erp/auth';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';
import {
  LeaveRequestDto,
  PaginatedLeaveResponse,
} from '../dtos/leave.dto';

@Injectable({ providedIn: 'root' })
export class LeaveRequestService {
  private http = inject(HttpClient);
  private env = inject<AppEnvironment>(ENVIRONMENT);

  constructor() {
    //
  }
  deleteLeaveRequest(id: string) {
    return this.http.delete<ApiResponse<LeaveRequestDto>>(
      this.env.apiUrl + '/leave/delete-leave-request/' + id
    );
  }
  getLeaveRequests() {
    return this.http.get<ApiResponse<PaginatedLeaveResponse<LeaveRequestDto>>>(
      this.env.apiUrl + '/leave/all-leave-requests'
    );
  }
  requestForLeave(data: LeaveRequestDto) {
    return this.http.post<ApiResponse<LeaveRequestDto>>(
      this.env.apiUrl + '/leave/create-leave-request',
      data
    );
  }
  updateLeaveRequest(data: LeaveRequestDto) {
    return this.http.put<ApiResponse<LeaveRequestDto>>(
      this.env.apiUrl + '/leave/update-leave-request/' + data.id,
      data
    );
  }
  myLeaveRequests(userId: string) {
    return this.http.get<ApiResponse<PaginatedLeaveResponse<LeaveRequestDto>>>(
      this.env.apiUrl + '/leave/user-requests/' + userId
    );
  }
}
