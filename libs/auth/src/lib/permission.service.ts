import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';
import { UserPermissionDto } from './dtos/permission.dto';
import { ApiResponse } from './dtos/api.response';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private http = inject(HttpClient);
  private env = inject<AppEnvironment>(ENVIRONMENT);
  constructor(private router: Router) {}

  getUserPermissions(userId: string) {
    return this.http.get<ApiResponse<UserPermissionDto[]>>(
      this.env.apiUrl + '/Permission/UserPermissions/' + userId
    );
  }
  assignUserPermission(selectedStaffId: string, name: string) {
    return this.http.post<ApiResponse<any>>(
      this.env.apiUrl + '/Permission/GrantPermissionToUser',
      { userId: selectedStaffId, permission: name }
    );
  }
  revokeUserPermission(selectedStaffId: string, name: string) {
    return this.http.post<ApiResponse<any>>(
      this.env.apiUrl + '/Permission/RevokePermissionFromUser',
      { userId: selectedStaffId, permission: name }
    );}
}
