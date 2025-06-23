import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';
import { Router } from '@angular/router';
import { RoleDto } from './dtos/role.dto';


@Injectable({providedIn:'root'})
export class RoleService {
  private http = inject(HttpClient);
  private env = inject<AppEnvironment>(ENVIRONMENT);
  constructor(private router: Router) {
     
  }
  getRoles() {
    return this.http.get<RoleDto[]>(this.env.apiUrl + '/role');
  }
}
