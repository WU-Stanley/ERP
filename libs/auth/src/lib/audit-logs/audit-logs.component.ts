import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuditLogFilters, AuditLogQueryDto, AuditLogStatsDto } from '../dtos/audit-log.dto';
import { AuditLogService } from '../audit-log.service';

@Component({
  selector: 'lib-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-logs.component.html',
})
export class AuditLogsComponent implements OnInit {
  logs: AuditLogQueryDto[] = [];
  stats: AuditLogStatsDto | null = null;
  filters: AuditLogFilters = {};
  page = 1;
  pageSize = 25;
  totalCount = 0;
  totalPages = 0;
  isLoading = true;
  errorMessage = '';
  expandedLogId = '';

  actionTypes = ['Login', 'Logout', 'Create', 'Update', 'Delete', 'CreateFailed', 'UpdateFailed', 'DeleteFailed'];

  constructor(private auditLogService: AuditLogService) {}

  ngOnInit() {
    this.loadStats();
    this.loadLogs();
  }

  loadLogs(page = this.page) {
    this.page = page;
    this.isLoading = true;
    this.errorMessage = '';

    this.auditLogService.getLogs(this.page, this.pageSize, this.filters).subscribe({
      next: (response) => {
        const data = response.data;
        this.logs = data?.logs ?? [];
        this.totalCount = data?.totalCount ?? 0;
        this.totalPages = data?.totalPages ?? 0;
        this.page = data?.page ?? this.page;
        this.pageSize = data?.pageSize ?? this.pageSize;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load audit logs.';
        this.isLoading = false;
      },
    });
  }

  loadStats() {
    this.auditLogService.getStats().subscribe({
      next: (response) => {
        this.stats = response.data ?? null;
      },
    });
  }

  applyFilters() {
    this.loadLogs(1);
  }

  resetFilters() {
    this.filters = {};
    this.loadLogs(1);
  }

  toggleDetails(log: AuditLogQueryDto) {
    this.expandedLogId = this.expandedLogId === log.id ? '' : log.id;
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.loadLogs(this.page + 1);
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.loadLogs(this.page - 1);
    }
  }

  actionClass(actionType: string) {
    const normalized = actionType.toLowerCase();
    if (normalized.includes('failed')) {
      return 'bg-rose-50 text-rose-700';
    }
    if (normalized.includes('delete')) {
      return 'bg-orange-50 text-orange-700';
    }
    if (normalized.includes('update')) {
      return 'bg-amber-50 text-amber-700';
    }
    if (normalized.includes('create') || normalized.includes('login')) {
      return 'bg-emerald-50 text-emerald-700';
    }
    return 'bg-slate-100 text-slate-600';
  }

  formatJson(value?: string | null) {
    if (!value) {
      return 'No values captured';
    }

    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }

  trackByLogId(_: number, log: AuditLogQueryDto) {
    return log.id;
  }
}
