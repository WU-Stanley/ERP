import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';
import { Router } from '@angular/router';
import { DepartmentDto } from './dtos/department.dto';
import { ApiResponse } from './dtos/api.response';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private http = inject(HttpClient);
  private env = inject<AppEnvironment>(ENVIRONMENT);
  constructor(private router: Router) {}
  getDepartments() {
    return this.http.get<ApiResponse<DepartmentDto[]>>(
      this.env.apiUrl + '/department',
      {
        withCredentials: true,
      }
    );
  }
  createDepartment(value: any) {
    return this.http.post<ApiResponse<DepartmentDto>>(
      this.env.apiUrl + '/department',
      value,
      { withCredentials: true }
    );
  }
  updateDepartment(value: any) {
    return this.http.put<ApiResponse<DepartmentDto>>(
      this.env.apiUrl + '/department/' + value.id,
      value,
      { withCredentials: true }
    );
  }
  deleteDepartment(id: string) {
    return this.http.delete<ApiResponse<DepartmentDto>>(
      this.env.apiUrl + '/department/' + id,
      { withCredentials: true }
    );
  }
  getDepartmentById(id: string) {
    return this.http.get<ApiResponse<DepartmentDto>>(
      this.env.apiUrl + '/department/' + id,
      {
        withCredentials: true,
      }
    );
  }
}
