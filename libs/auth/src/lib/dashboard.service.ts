import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';
import { ApiResponse } from './dtos/api.response';
import { AdminDashboardSummaryDto } from './dtos/dashboard.dto';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly env = inject<AppEnvironment>(ENVIRONMENT);

  getAdminSummary() {
    return this.http.get<ApiResponse<AdminDashboardSummaryDto>>(
      `${this.env.apiUrl}/dashboard/admin-summary`,
      { withCredentials: true }
    );
  }
}
