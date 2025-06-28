import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';
import { Router } from '@angular/router';
import { DepartmentDto } from './dtos/department.dto';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private http = inject(HttpClient);
  private env = inject<AppEnvironment>(ENVIRONMENT);
  constructor(private router: Router) {}
  getDepartments() {
    return this.http.get<DepartmentDto[]>(this.env.apiUrl + '/department');
  }
}
