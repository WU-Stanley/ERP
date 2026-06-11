import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';
import { Router } from '@angular/router';
import { RoleDto } from './dtos/role.dto';
import { ApiResponse } from './dtos/api.response';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private http = inject(HttpClient);
  private env = inject<AppEnvironment>(ENVIRONMENT);
  constructor(private router: Router) {}

  getRoleById(id: string) {
    return this.http.get<ApiResponse<RoleDto>>(
      this.env.apiUrl + '/role/' + id,
      {
        withCredentials: true,
      }
    );
  }
  deleteRole(id: string) {
    return this.http.delete<ApiResponse<RoleDto>>(
      this.env.apiUrl + '/role/' + id,
      { withCredentials: true }
    );
  }
  getRoles() {
    return this.http.get<ApiResponse<RoleDto[]>>(this.env.apiUrl + '/role', {
      withCredentials: true,
    });
  }

  addRole(value: RoleDto) {
    return this.http.post<ApiResponse<RoleDto>>(
      this.env.apiUrl + '/role',
      value,
      { withCredentials: true }
    );
  }
  updateRole(data: RoleDto) {
    return this.http.put<ApiResponse<RoleDto>>(
      this.env.apiUrl + '/role/' + data.id,
      data,
      { withCredentials: true }
    );
  }
}
