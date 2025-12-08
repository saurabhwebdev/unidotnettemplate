import { api } from './api';

export interface AuditLog {
  id: string;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  oldValues: string | null;
  newValues: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  additionalInfo: string | null;
  isSuccess: boolean;
  errorMessage: string | null;
  createdAt: string;
}

export interface AuditLogFilter {
  page?: number;
  pageSize?: number;
  userId?: string;
  action?: string;
  entityType?: string;
  fromDate?: string;
  toDate?: string;
  isSuccess?: boolean;
  search?: string;
}

export interface AuditLogPagedResult {
  items: AuditLog[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const auditLogsService = {
  async getAuditLogs(filter: AuditLogFilter = {}): Promise<AuditLogPagedResult> {
    const params = new URLSearchParams();

    if (filter.page) params.append('page', filter.page.toString());
    if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());
    if (filter.userId) params.append('userId', filter.userId);
    if (filter.action) params.append('action', filter.action);
    if (filter.entityType) params.append('entityType', filter.entityType);
    if (filter.fromDate) params.append('fromDate', filter.fromDate);
    if (filter.toDate) params.append('toDate', filter.toDate);
    if (filter.isSuccess !== undefined) params.append('isSuccess', filter.isSuccess.toString());
    if (filter.search) params.append('search', filter.search);

    const response = await api.get(`/auditlogs?${params.toString()}`);
    return response.data;
  },

  async getAuditLogById(id: string): Promise<AuditLog> {
    const response = await api.get(`/auditlogs/${id}`);
    return response.data;
  },

  async getDistinctActions(): Promise<string[]> {
    const response = await api.get('/auditlogs/actions');
    return response.data;
  },

  async getDistinctEntityTypes(): Promise<string[]> {
    const response = await api.get('/auditlogs/entity-types');
    return response.data;
  }
};
