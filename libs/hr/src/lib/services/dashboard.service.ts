import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@erp/auth';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';
import {
  HrDashboardSummaryDto,
  LeaveDashboardSummaryDto,
} from '../dtos/dashboard.dto';

@Injectable({ providedIn: 'root' })
export class HrDashboardSummaryService {
  private readonly http = inject(HttpClient);
  private readonly env = inject<AppEnvironment>(ENVIRONMENT);

  getHrSummary() {
    return this.http.get<ApiResponse<HrDashboardSummaryDto>>(
      `${this.env.apiUrl}/dashboard/hr-summary`,
      { withCredentials: true }
    );
  }

  getLeaveSummary() {
    return this.http.get<ApiResponse<LeaveDashboardSummaryDto>>(
      `${this.env.apiUrl}/dashboard/leave-summary`,
      { withCredentials: true }
    );
  }
}
