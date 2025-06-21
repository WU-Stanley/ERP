import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';
import { Router } from '@angular/router';

export interface Role {
  id: number;
  name: string;
  description: string;
}

@Injectable({providedIn:'root'})
export class RoleService {
  private http = inject(HttpClient);
  private env = inject<AppEnvironment>(ENVIRONMENT);
  constructor(private router: Router) {
    console.log('api url', this.env);
  }
  getRoles() {
    return this.http.get<Role[]>(this.env.apiUrl + '/role');
  }
}
