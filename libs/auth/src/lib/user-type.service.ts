import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';
import { ApiResponse } from './dtos/api.response';
import { UserTypeDto } from './dtos/usertype.dto';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class UserTypeService {
  private http = inject(HttpClient);
  private env = inject<AppEnvironment>(ENVIRONMENT);
  constructor(private router: Router) {}

  addUserType(data: UserTypeDto) {
    return this.http.post<ApiResponse<UserTypeDto>>(
      this.env.apiUrl + '/auth/create-user-type',
      data,
      { withCredentials: true }
    );
  }
  getUserTypes() {
    return this.http.get<{
      message: string;
      status: boolean;
      data: Array<UserTypeDto>;
    }>(this.env.apiUrl + '/auth/get-user-type', { withCredentials: true });
  }
}
