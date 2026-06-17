import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@erp/auth';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';
import {
  EmployeeDetailsDto,
  EmployeeDirectoryDto,
  EmployeeProfileUpdateRequestDto,
  EmployeeSelfServiceUpdateDto,
  EmploymentAssignmentDto,
  EmploymentDetailsDto,
  PaginatedResponse,
  ProfileUpdateDecisionDto,
} from '../dtos/employee.dto';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly env = inject<AppEnvironment>(ENVIRONMENT);

  getEmployees(pageNumber = 1, pageSize = 100) {
    return this.http.get<ApiResponse<PaginatedResponse<EmployeeDirectoryDto>>>(
      `${this.env.apiUrl}/Employees`,
      {
        params: { pageNumber, pageSize },
        withCredentials: true,
      }
    );
  }

  getDepartmentEmployees(departmentId: string) {
    return this.http.get<ApiResponse<EmployeeDirectoryDto[]>>(
      `${this.env.apiUrl}/Department/${departmentId}/employees`,
      { withCredentials: true }
    );
  }

  getEmployee(employeeId: string) {
    return this.http.get<ApiResponse<EmployeeDetailsDto>>(
      `${this.env.apiUrl}/Employees/${employeeId}`,
      { withCredentials: true }
    );
  }

  getOwnEmployee() {
    return this.http.get<ApiResponse<EmployeeDetailsDto>>(
      `${this.env.apiUrl}/Employees/me`,
      { withCredentials: true }
    );
  }

  updateEmployee(employee: EmployeeDetailsDto) {
    return this.http.put<ApiResponse<EmployeeDetailsDto>>(
      `${this.env.apiUrl}/Employees/${employee.employeeId}`,
      employee,
      { withCredentials: true }
    );
  }

  updateOwnEmployee(update: EmployeeSelfServiceUpdateDto) {
    return this.http.patch<ApiResponse<EmployeeDetailsDto>>(
      `${this.env.apiUrl}/Employees/me/self-service`,
      update,
      { withCredentials: true }
    );
  }

  submitOwnProfileUpdateRequest(update: EmployeeSelfServiceUpdateDto) {
    return this.http.post<ApiResponse<EmployeeProfileUpdateRequestDto>>(
      `${this.env.apiUrl}/Employees/me/profile-update-requests`,
      update,
      { withCredentials: true }
    );
  }

  getOwnProfileUpdateRequests() {
    return this.http.get<ApiResponse<EmployeeProfileUpdateRequestDto[]>>(
      `${this.env.apiUrl}/Employees/me/profile-update-requests`,
      { withCredentials: true }
    );
  }

  getProfileUpdateRequests(status = 'Pending') {
    return this.http.get<ApiResponse<EmployeeProfileUpdateRequestDto[]>>(
      `${this.env.apiUrl}/Employees/profile-update-requests`,
      { params: { status }, withCredentials: true }
    );
  }

  reviewProfileUpdateRequest(requestId: string, decision: ProfileUpdateDecisionDto) {
    return this.http.post<ApiResponse<EmployeeProfileUpdateRequestDto>>(
      `${this.env.apiUrl}/Employees/profile-update-requests/${requestId}/decision`,
      decision,
      { withCredentials: true }
    );
  }

  getEmploymentHistory(employeeId: string) {
    return this.http.get<ApiResponse<EmploymentDetailsDto[]>>(
      `${this.env.apiUrl}/EmploymentDetails/employee/${employeeId}/history`,
      { withCredentials: true }
    );
  }

  assignEmployment(employeeId: string, employment: EmploymentAssignmentDto) {
    return this.http.post<ApiResponse<EmploymentDetailsDto>>(
      `${this.env.apiUrl}/EmploymentDetails/employee/${employeeId}`,
      employment,
      { withCredentials: true }
    );
  }

  endEmployment(employmentId: string) {
    return this.http.put<ApiResponse<{ employmentId: string }>>(
      `${this.env.apiUrl}/EmploymentDetails/${employmentId}/end`,
      {},
      { withCredentials: true }
    );
  }
}
