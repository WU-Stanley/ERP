import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';
import { Router } from '@angular/router';
import { RoleDto } from './dtos/role.dto';
import { ApiResponse } from './dtos/api.response';


@Injectable({providedIn:'root'})
export class RoleService {

  private http = inject(HttpClient);
  private env = inject<AppEnvironment>(ENVIRONMENT);
  constructor(private router: Router) {
     
  }
  getRoles() {
    return this.http.get<ApiResponse<RoleDto[]>>(this.env.apiUrl + '/role',{withCredentials:true});
  }

        addRole(value: RoleDto) {
          return this.http.post<ApiResponse<RoleDto>>(this.env.apiUrl + '/role', value, { withCredentials: true });
        }
}
