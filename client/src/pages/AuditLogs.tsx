import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { colors } from '../config/theme.config';
import { auditLogsService } from '../services/auditLogs.service';
import type { AuditLog, AuditLogFilter } from '../services/auditLogs.service';
import { DashboardLayout } from '../components/DashboardLayout';
import { Select } from '../components/ui/select';
import { Pagination } from '../components/ui/pagination';
import { Mail } from 'lucide-react';

export default function AuditLogs() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [actions, setActions] = useState<string[]>([]);
  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [filter, setFilter] = useState<AuditLogFilter>({
    page: 1,
    pageSize: 20,
    search: '',
    action: '',
    entityType: '',
    isSuccess: undefined
  });

  useEffect(() => {
    loadAuditLogs();
    loadFilters();
  }, [filter.page, filter.action, filter.entityType, filter.isSuccess]);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const result = await auditLogsService.getAuditLogs(filter);
      setAuditLogs(result.items);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFilters = async () => {
    try {
      const [actionsResult, entityTypesResult] = await Promise.all([
        auditLogsService.getDistinctActions(),
        auditLogsService.getDistinctEntityTypes()
      ]);
      setActions(actionsResult);
      setEntityTypes(entityTypesResult);
    } catch (error) {
      console.error('Failed to load filters:', error);
    }
  };

  const handleSearch = () => {
    setFilter({ ...filter, page: 1 });
    loadAuditLogs();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getActionBadgeColor = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('login')) return 'bg-blue-500/20 text-blue-400';
    if (actionLower.includes('logout')) return 'bg-gray-500/20 text-gray-400';
    if (actionLower.includes('register')) return 'bg-green-500/20 text-green-400';
    if (actionLower.includes('create')) return 'bg-emerald-500/20 text-emerald-400';
    if (actionLower.includes('update')) return 'bg-yellow-500/20 text-yellow-400';
    if (actionLower.includes('delete')) return 'bg-red-500/20 text-red-400';
    return 'bg-purple-500/20 text-purple-400';
  };

  const viewLogDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setShowModal(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Filters */}
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: colors.bgPrimary, border: `1px solid ${colors.border}` }}
        >
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search by email, action, entity..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.bgSecondary,
                  color: colors.textPrimary,
                  border: `1px solid ${colors.border}`,
                }}
              />
            </div>

            {/* Action Filter */}
            <div className="w-[140px]">
              <Select
                value={filter.action}
                onChange={(value) => setFilter({ ...filter, action: value, page: 1 })}
                placeholder="All Actions"
                options={actions.map((action) => ({ value: action, label: action }))}
              />
            </div>

            {/* Entity Type Filter */}
            <div className="w-[160px]">
              <Select
                value={filter.entityType}
                onChange={(value) => setFilter({ ...filter, entityType: value, page: 1 })}
                placeholder="All Types"
                options={entityTypes.map((type) => ({ value: type, label: type }))}
              />
            </div>

            {/* Status Filter */}
            <div className="w-[130px]">
              <Select
                value={filter.isSuccess === undefined ? '' : filter.isSuccess.toString()}
                onChange={(value) =>
                  setFilter({
                    ...filter,
                    isSuccess: value === '' ? undefined : value === 'true',
                    page: 1,
                  })
                }
                placeholder="All Status"
                options={[
                  { value: 'true', label: 'Success' },
                  { value: 'false', label: 'Failed' },
                ]}
              />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="px-5 py-2.5 rounded-lg font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: colors.primary, color: 'white' }}
            >
              Search
            </button>

            {/* Email Queue Button */}
            <Link
              to="/email-queue"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: colors.bgSecondary, border: `1px solid ${colors.border}`, color: colors.textPrimary }}
            >
              <Mail size={18} />
              Email Queue
            </Link>
          </div>
        </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: colors.bgSecondary, border: `1px solid ${colors.border}` }}
      >
        {loading ? (
          <div className="p-8 text-center" style={{ color: colors.textMuted }}>
            Loading audit logs...
          </div>
        ) : auditLogs.length === 0 ? (
          <div className="p-8 text-center" style={{ color: colors.textMuted }}>
            No audit logs found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: colors.bgTertiary }}>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: colors.textMuted }}>
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: colors.textMuted }}>
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: colors.textMuted }}>
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: colors.textMuted }}>
                    Entity
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: colors.textMuted }}>
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: colors.textMuted }}>
                    IP Address
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium" style={{ color: colors.textMuted }}>
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-t transition-colors hover:bg-opacity-50"
                    style={{ borderColor: colors.border }}
                  >
                    <td className="px-4 py-3 text-sm" style={{ color: colors.textSecondary }}>
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                          {log.userName || 'System'}
                        </div>
                        <div className="text-xs" style={{ color: colors.textMuted }}>
                          {log.userEmail || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(log.action)}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm" style={{ color: colors.textPrimary }}>
                        {log.entityType}
                      </div>
                      {log.entityId && (
                        <div className="text-xs truncate max-w-[150px]" style={{ color: colors.textMuted }}>
                          {log.entityId}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {log.isSuccess ? (
                        <span className="flex items-center gap-1 text-green-400 text-sm">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Success
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-400 text-sm">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: colors.textMuted }}>
                      {log.ipAddress || '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => viewLogDetails(log)}
                        className="p-2 rounded-lg transition-colors hover:bg-opacity-80"
                        style={{ backgroundColor: colors.bgTertiary }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={filter.page || 1}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={filter.pageSize || 20}
          onPageChange={(page) => setFilter({ ...filter, page })}
          onPageSizeChange={(pageSize) => setFilter({ ...filter, pageSize, page: 1 })}
        />
      </div>

      {/* Detail Modal */}
      {showModal && selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="w-full max-w-2xl rounded-xl max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: colors.bgSecondary }}
          >
            <div
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: colors.border }}
            >
              <h2 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                Audit Log Details
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg transition-colors"
                style={{ backgroundColor: colors.bgTertiary }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium" style={{ color: colors.textMuted }}>
                    Timestamp
                  </label>
                  <div className="text-sm" style={{ color: colors.textPrimary }}>
                    {formatDate(selectedLog.createdAt)}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium" style={{ color: colors.textMuted }}>
                    Status
                  </label>
                  <div>
                    {selectedLog.isSuccess ? (
                      <span className="text-green-400 text-sm">Success</span>
                    ) : (
                      <span className="text-red-400 text-sm">Failed</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium" style={{ color: colors.textMuted }}>
                    User
                  </label>
                  <div className="text-sm" style={{ color: colors.textPrimary }}>
                    {selectedLog.userName || 'System'}
                  </div>
                  <div className="text-xs" style={{ color: colors.textMuted }}>
                    {selectedLog.userEmail || '-'}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium" style={{ color: colors.textMuted }}>
                    Action
                  </label>
                  <div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(selectedLog.action)}`}
                    >
                      {selectedLog.action}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium" style={{ color: colors.textMuted }}>
                    Entity Type
                  </label>
                  <div className="text-sm" style={{ color: colors.textPrimary }}>
                    {selectedLog.entityType}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium" style={{ color: colors.textMuted }}>
                    Entity ID
                  </label>
                  <div className="text-sm font-mono" style={{ color: colors.textPrimary }}>
                    {selectedLog.entityId || '-'}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium" style={{ color: colors.textMuted }}>
                    IP Address
                  </label>
                  <div className="text-sm font-mono" style={{ color: colors.textPrimary }}>
                    {selectedLog.ipAddress || '-'}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium" style={{ color: colors.textMuted }}>
                    User Agent
                  </label>
                  <div className="text-xs truncate" style={{ color: colors.textMuted }}>
                    {selectedLog.userAgent || '-'}
                  </div>
                </div>
              </div>

              {selectedLog.additionalInfo && (
                <div>
                  <label className="text-xs font-medium" style={{ color: colors.textMuted }}>
                    Additional Info
                  </label>
                  <div className="text-sm mt-1" style={{ color: colors.textPrimary }}>
                    {selectedLog.additionalInfo}
                  </div>
                </div>
              )}

              {selectedLog.errorMessage && (
                <div>
                  <label className="text-xs font-medium text-red-400">Error Message</label>
                  <div
                    className="text-sm mt-1 p-3 rounded-lg bg-red-500/10 text-red-400 font-mono"
                  >
                    {selectedLog.errorMessage}
                  </div>
                </div>
              )}

              {selectedLog.oldValues && (
                <div>
                  <label className="text-xs font-medium" style={{ color: colors.textMuted }}>
                    Old Values
                  </label>
                  <pre
                    className="text-xs mt-1 p-3 rounded-lg overflow-x-auto"
                    style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
                  >
                    {JSON.stringify(JSON.parse(selectedLog.oldValues), null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.newValues && (
                <div>
                  <label className="text-xs font-medium" style={{ color: colors.textMuted }}>
                    New Values
                  </label>
                  <pre
                    className="text-xs mt-1 p-3 rounded-lg overflow-x-auto"
                    style={{ backgroundColor: colors.bgTertiary, color: colors.textPrimary }}
                  >
                    {JSON.stringify(JSON.parse(selectedLog.newValues), null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}
