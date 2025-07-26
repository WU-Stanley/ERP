import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse, EmploymentTypeDto } from '@erp/auth';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';
import { LeaveTypeDto } from '../dtos/leave.dto';

const route = '/auth';
@Injectable({ providedIn: 'root' })
export class EmploymentTypeService {
  private http = inject(HttpClient);
  private env = inject<AppEnvironment>(ENVIRONMENT);

  constructor() {}

  getEmploymentTypes() {
    return this.http.get<ApiResponse<EmploymentTypeDto>>(
      this.env.apiUrl + route + '/get-employment-types'
    );
  }
  createEmployementType(data: EmploymentTypeDto) {
    return this.http.post(
      this.env.apiUrl + route + '/create-employment-type',
      data
    );
  }
}
