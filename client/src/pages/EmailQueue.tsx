import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Modal } from '../components/ui/modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { SkeletonTable } from '../components/ui/skeleton';
import { Pagination } from '../components/ui/pagination';
import { useToast } from '../components/ui/toast';
import { colors } from '../config/theme.config';
import { emailQueueService } from '../services/emailQueue.service';
import type { EmailQueueItem, EmailQueueStats, EmailQueueFilter } from '../services/emailQueue.service';
import {
  Mail,
  Search,
  RefreshCw,
  Play,
  XCircle,
  RotateCcw,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  Send,
  Ban,
  Calendar,
  User,
  FileText,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmailQueue() {
  const { addToast } = useToast();
  const [emails, setEmails] = useState<EmailQueueItem[]>([]);
  const [stats, setStats] = useState<EmailQueueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filter state
  const [filter, setFilter] = useState<EmailQueueFilter>({
    page: 1,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal state
  const [selectedEmail, setSelectedEmail] = useState<EmailQueueItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Action loading states
  const [processingEmails, setProcessingEmails] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadEmails();
    loadStats();
  }, [filter]);

  const loadEmails = async () => {
    setLoading(true);
    try {
      const result = await emailQueueService.getEmails({
        ...filter,
        searchTerm: searchTerm || undefined,
        status: statusFilter || undefined,
      });
      setEmails(result.items);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Failed to load emails:', error);
      addToast({ type: 'error', title: 'Error', message: 'Failed to load email queue' });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const result = await emailQueueService.getStats();
      setStats(result);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleSearch = () => {
    setFilter({ ...filter, page: 1 });
    loadEmails();
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setFilter({ ...filter, page: 1 });
  };

  const handleProcessEmails = async () => {
    setProcessingEmails(true);
    try {
      const result = await emailQueueService.processEmails(10);
      addToast({ type: 'success', title: 'Emails Processed', message: result.message });
      loadEmails();
      loadStats();
    } catch (error: any) {
      addToast({ type: 'error', title: 'Error', message: error.response?.data?.message || 'Failed to process emails' });
    } finally {
      setProcessingEmails(false);
    }
  };

  const handleCancelEmail = async (id: string) => {
    setActionLoading(id);
    try {
      await emailQueueService.cancelEmail(id);
      addToast({ type: 'success', title: 'Email Cancelled', message: 'The email has been cancelled successfully' });
      loadEmails();
      loadStats();
    } catch (error: any) {
      addToast({ type: 'error', title: 'Error', message: error.response?.data?.message || 'Failed to cancel email' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRetryEmail = async (id: string) => {
    setActionLoading(id);
    try {
      await emailQueueService.retryEmail(id);
      addToast({ type: 'success', title: 'Email Queued for Retry', message: 'The email has been queued for retry' });
      loadEmails();
      loadStats();
    } catch (error: any) {
      addToast({ type: 'error', title: 'Error', message: error.response?.data?.message || 'Failed to retry email' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteEmail = async (id: string) => {
    if (!confirm('Are you sure you want to delete this email?')) return;
    setActionLoading(id);
    try {
      await emailQueueService.deleteEmail(id);
      addToast({ type: 'success', title: 'Email Deleted', message: 'The email has been deleted successfully' });
      loadEmails();
      loadStats();
    } catch (error: any) {
      addToast({ type: 'error', title: 'Error', message: error.response?.data?.message || 'Failed to delete email' });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      Pending: { bg: '#fef3c7', text: '#d97706', icon: <Clock size={12} /> },
      Processing: { bg: '#dbeafe', text: '#2563eb', icon: <Loader2 size={12} className="animate-spin" /> },
      Sent: { bg: '#d1fae5', text: '#059669', icon: <CheckCircle2 size={12} /> },
      Failed: { bg: '#fee2e2', text: '#dc2626', icon: <AlertCircle size={12} /> },
      Cancelled: { bg: '#e5e7eb', text: '#6b7280', icon: <Ban size={12} /> },
    };

    const style = styles[status] || styles.Pending;

    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: style.bg, color: style.text }}
      >
        {style.icon}
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) => (
    <div
      className="p-4 rounded-lg"
      style={{ backgroundColor: colors.bgSecondary, border: `1px solid ${colors.border}` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium" style={{ color: colors.textMuted }}>{title}</p>
          <p className="text-2xl font-bold mt-1" style={{ color: colors.textPrimary }}>{value}</p>
        </div>
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Link
            to="/audit-logs"
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100"
            style={{ color: colors.textMuted }}
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back to Audit Logs</span>
          </Link>
          <Button
            onClick={handleProcessEmails}
            disabled={processingEmails}
            className="flex items-center gap-2"
            style={{ backgroundColor: colors.primary, color: 'white' }}
          >
            {processingEmails ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Play size={16} />
            )}
            {processingEmails ? 'Processing...' : 'Process Queue'}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {statsLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-lg animate-pulse"
                style={{ backgroundColor: colors.bgSecondary, height: '88px' }}
              />
            ))
          ) : stats && (
            <>
              <StatCard title="Total Emails" value={stats.totalEmails} icon={<Mail size={20} />} color="#6366f1" />
              <StatCard title="Pending" value={stats.pendingEmails} icon={<Clock size={20} />} color="#f59e0b" />
              <StatCard title="Processing" value={stats.processingEmails} icon={<Loader2 size={20} />} color="#3b82f6" />
              <StatCard title="Sent" value={stats.sentEmails} icon={<CheckCircle2 size={20} />} color="#10b981" />
              <StatCard title="Failed" value={stats.failedEmails} icon={<AlertCircle size={20} />} color="#ef4444" />
              <StatCard title="Today Sent" value={stats.todaySent} icon={<Send size={20} />} color="#8b5cf6" />
            </>
          )}
        </div>

        {/* Filters */}
        <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: colors.textMuted }}
                />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search by email, name, or subject..."
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-md text-sm min-w-[150px]"
                style={{
                  backgroundColor: colors.bgSecondary,
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary,
                }}
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Sent">Sent</option>
                <option value="Failed">Failed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <Button
                onClick={() => {
                  loadEmails();
                  loadStats();
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Email Queue Table */}
        <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: colors.textPrimary }}>
              <Mail size={20} />
              Email Queue ({totalCount})
            </CardTitle>
            <CardDescription style={{ color: colors.textMuted }}>
              List of all emails in the queue
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <SkeletonTable />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emails.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8" style={{ color: colors.textMuted }}>
                        No emails in the queue
                      </TableCell>
                    </TableRow>
                  ) : (
                    emails.map((email) => (
                      <TableRow key={email.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium" style={{ color: colors.textPrimary }}>
                              {email.toName || 'Unknown'}
                            </p>
                            <p className="text-xs" style={{ color: colors.textMuted }}>
                              {email.toEmail}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p
                            className="max-w-[200px] truncate"
                            style={{ color: colors.textPrimary }}
                            title={email.subject}
                          >
                            {email.subject}
                          </p>
                        </TableCell>
                        <TableCell>
                          <span
                            className="text-xs px-2 py-1 rounded"
                            style={{ backgroundColor: colors.primaryLight, color: colors.primary }}
                          >
                            {email.emailType}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(email.status)}</TableCell>
                        <TableCell>
                          <p className="text-sm" style={{ color: colors.textMuted }}>
                            {formatDate(email.createdAt)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedEmail(email);
                                setShowDetailModal(true);
                              }}
                              title="View Details"
                            >
                              <Eye size={14} />
                            </Button>
                            {email.status === 'Pending' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelEmail(email.id)}
                                disabled={actionLoading === email.id}
                                title="Cancel"
                                className="text-yellow-600 hover:bg-yellow-50"
                              >
                                {actionLoading === email.id ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <XCircle size={14} />
                                )}
                              </Button>
                            )}
                            {email.status === 'Failed' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRetryEmail(email.id)}
                                disabled={actionLoading === email.id}
                                title="Retry"
                                className="text-blue-600 hover:bg-blue-50"
                              >
                                {actionLoading === email.id ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <RotateCcw size={14} />
                                )}
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteEmail(email.id)}
                              disabled={actionLoading === email.id}
                              title="Delete"
                              className="text-red-600 hover:bg-red-50"
                            >
                              {actionLoading === email.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
            <Pagination
              currentPage={filter.page || 1}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={filter.pageSize || 10}
              onPageChange={(page) => setFilter({ ...filter, page })}
              onPageSizeChange={(pageSize) => setFilter({ ...filter, page: 1, pageSize })}
            />
          </CardContent>
        </Card>

        {/* Email Detail Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedEmail(null);
          }}
          title="Email Details"
          size="lg"
        >
          {selectedEmail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: colors.textMuted }}>
                    Recipient
                  </label>
                  <p style={{ color: colors.textPrimary }}>
                    {selectedEmail.toName || 'Unknown'} &lt;{selectedEmail.toEmail}&gt;
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: colors.textMuted }}>
                    Status
                  </label>
                  {getStatusBadge(selectedEmail.status)}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: colors.textMuted }}>
                  Subject
                </label>
                <p style={{ color: colors.textPrimary }}>{selectedEmail.subject}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: colors.textMuted }}>
                    Email Type
                  </label>
                  <p style={{ color: colors.textPrimary }}>{selectedEmail.emailType}</p>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: colors.textMuted }}>
                    Retry Count
                  </label>
                  <p style={{ color: colors.textPrimary }}>
                    {selectedEmail.retryCount} / {selectedEmail.maxRetries}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium block mb-1 flex items-center gap-1" style={{ color: colors.textMuted }}>
                    <Calendar size={12} /> Created At
                  </label>
                  <p className="text-sm" style={{ color: colors.textPrimary }}>
                    {formatDate(selectedEmail.createdAt)}
                  </p>
                </div>
                {selectedEmail.sentAt && (
                  <div>
                    <label className="text-xs font-medium block mb-1 flex items-center gap-1" style={{ color: colors.textMuted }}>
                      <Send size={12} /> Sent At
                    </label>
                    <p className="text-sm" style={{ color: colors.textPrimary }}>
                      {formatDate(selectedEmail.sentAt)}
                    </p>
                  </div>
                )}
                {selectedEmail.failedAt && (
                  <div>
                    <label className="text-xs font-medium block mb-1 flex items-center gap-1" style={{ color: colors.textMuted }}>
                      <AlertCircle size={12} /> Failed At
                    </label>
                    <p className="text-sm" style={{ color: colors.textPrimary }}>
                      {formatDate(selectedEmail.failedAt)}
                    </p>
                  </div>
                )}
              </div>

              {selectedEmail.triggeredByUserEmail && (
                <div>
                  <label className="text-xs font-medium block mb-1 flex items-center gap-1" style={{ color: colors.textMuted }}>
                    <User size={12} /> Triggered By
                  </label>
                  <p className="text-sm" style={{ color: colors.textPrimary }}>
                    {selectedEmail.triggeredByUserEmail}
                  </p>
                </div>
              )}

              {selectedEmail.errorMessage && (
                <div>
                  <label className="text-xs font-medium block mb-1 flex items-center gap-1" style={{ color: colors.textMuted }}>
                    <AlertCircle size={12} /> Error Message
                  </label>
                  <p
                    className="text-sm p-2 rounded"
                    style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
                  >
                    {selectedEmail.errorMessage}
                  </p>
                </div>
              )}

              <div>
                <label className="text-xs font-medium block mb-1 flex items-center gap-1" style={{ color: colors.textMuted }}>
                  <FileText size={12} /> Email Body
                </label>
                <div
                  className="p-3 rounded-lg max-h-[300px] overflow-auto text-sm"
                  style={{ backgroundColor: colors.bgSecondary, border: `1px solid ${colors.border}` }}
                >
                  {selectedEmail.isHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedEmail.body }} />
                  ) : (
                    <pre className="whitespace-pre-wrap" style={{ color: colors.textPrimary }}>
                      {selectedEmail.body}
                    </pre>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t" style={{ borderColor: colors.border }}>
                {selectedEmail.status === 'Pending' && (
                  <Button
                    onClick={() => {
                      handleCancelEmail(selectedEmail.id);
                      setShowDetailModal(false);
                    }}
                    variant="outline"
                    className="flex items-center gap-2 text-yellow-600"
                  >
                    <XCircle size={16} />
                    Cancel Email
                  </Button>
                )}
                {selectedEmail.status === 'Failed' && (
                  <Button
                    onClick={() => {
                      handleRetryEmail(selectedEmail.id);
                      setShowDetailModal(false);
                    }}
                    variant="outline"
                    className="flex items-center gap-2 text-blue-600"
                  >
                    <RotateCcw size={16} />
                    Retry Email
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedEmail(null);
                  }}
                  variant="outline"
                  className="ml-auto"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
