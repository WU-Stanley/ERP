export interface AuditLogQueryDto {
  id: string;
  actionType: string;
  userId?: string | null;
  userName?: string | null;
  entityName?: string | null;
  entityId?: string | null;
  description?: string | null;
  oldValues?: string | null;
  newValues?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

export interface AuditLogPaginationDto {
  logs: AuditLogQueryDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuditLogEntityStatsDto {
  entityName: string;
  count: number;
}

export interface AuditLogStatsDto {
  totalLogs: number;
  loginEvents: number;
  logoutEvents: number;
  createEvents: number;
  updateEvents: number;
  deleteEvents: number;
  topEntities: AuditLogEntityStatsDto[];
}

export interface AuditLogFilters {
  entityType?: string;
  actionType?: string;
  startDate?: string;
  endDate?: string;
  userId?: string;
}
