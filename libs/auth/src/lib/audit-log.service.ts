import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';
import { ApiResponse } from './dtos/api.response';
import {
  AuditLogFilters,
  AuditLogPaginationDto,
  AuditLogQueryDto,
  AuditLogStatsDto,
} from './dtos/audit-log.dto';

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  private readonly http = inject(HttpClient);
  private readonly env = inject<AppEnvironment>(ENVIRONMENT);

  getLogs(page = 1, pageSize = 25, filters: AuditLogFilters = {}) {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params = params.set(key, value);
      }
    });

    return this.http.get<ApiResponse<AuditLogPaginationDto>>(
      `${this.env.apiUrl}/AuditLogs`,
      { params, withCredentials: true }
    );
  }

  getLog(id: string) {
    return this.http.get<ApiResponse<AuditLogQueryDto>>(
      `${this.env.apiUrl}/AuditLogs/${id}`,
      { withCredentials: true }
    );
  }

  getStats() {
    return this.http.get<ApiResponse<AuditLogStatsDto>>(
      `${this.env.apiUrl}/AuditLogs/stats`,
      { withCredentials: true }
    );
  }
}
