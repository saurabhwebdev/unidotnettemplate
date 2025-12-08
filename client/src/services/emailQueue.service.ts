import { api } from './api';

export interface EmailQueueItem {
  id: string;
  toEmail: string;
  toName: string;
  subject: string;
  body: string;
  isHtml: boolean;
  status: string;
  retryCount: number;
  maxRetries: number;
  scheduledAt: string | null;
  sentAt: string | null;
  failedAt: string | null;
  errorMessage: string | null;
  triggeredByUserId: string | null;
  triggeredByUserEmail: string | null;
  emailType: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailQueueStats {
  totalEmails: number;
  pendingEmails: number;
  processingEmails: number;
  sentEmails: number;
  failedEmails: number;
  cancelledEmails: number;
  todaySent: number;
  todayFailed: number;
}

export interface CreateEmailQueueRequest {
  toEmail: string;
  toName: string;
  subject: string;
  body: string;
  isHtml?: boolean;
  scheduledAt?: string | null;
  emailType?: string;
}

export interface EmailQueueFilter {
  status?: string;
  emailType?: string;
  searchTerm?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedEmailQueue {
  items: EmailQueueItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

class EmailQueueService {
  async getEmails(filter: EmailQueueFilter = {}): Promise<PaginatedEmailQueue> {
    const params = new URLSearchParams();
    if (filter.status) params.append('status', filter.status);
    if (filter.emailType) params.append('emailType', filter.emailType);
    if (filter.searchTerm) params.append('searchTerm', filter.searchTerm);
    if (filter.fromDate) params.append('fromDate', filter.fromDate);
    if (filter.toDate) params.append('toDate', filter.toDate);
    if (filter.page) params.append('page', filter.page.toString());
    if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());

    const response = await api.get<PaginatedEmailQueue>(`/emailqueue?${params.toString()}`);
    return response.data;
  }

  async getEmailById(id: string): Promise<EmailQueueItem> {
    const response = await api.get<EmailQueueItem>(`/emailqueue/${id}`);
    return response.data;
  }

  async getStats(): Promise<EmailQueueStats> {
    const response = await api.get<EmailQueueStats>('/emailqueue/stats');
    return response.data;
  }

  async queueEmail(data: CreateEmailQueueRequest): Promise<EmailQueueItem> {
    const response = await api.post<EmailQueueItem>('/emailqueue', data);
    return response.data;
  }

  async cancelEmail(id: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(`/emailqueue/${id}/cancel`);
    return response.data;
  }

  async retryEmail(id: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(`/emailqueue/${id}/retry`);
    return response.data;
  }

  async processEmails(batchSize: number = 10): Promise<{ message: string; processedCount: number }> {
    const response = await api.post<{ message: string; processedCount: number }>(`/emailqueue/process?batchSize=${batchSize}`);
    return response.data;
  }

  async deleteEmail(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/emailqueue/${id}`);
    return response.data;
  }

  async clearOldEmails(daysOld: number = 30): Promise<{ message: string; deletedCount: number }> {
    const response = await api.delete<{ message: string; deletedCount: number }>(`/emailqueue/clear-old?daysOld=${daysOld}`);
    return response.data;
  }
}

export const emailQueueService = new EmailQueueService();
