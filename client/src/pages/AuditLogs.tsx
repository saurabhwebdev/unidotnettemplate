import { useState, useEffect } from 'react';
import { colors } from '../config/theme.config';
import { auditLogsService } from '../services/auditLogs.service';
import type { AuditLog, AuditLogFilter } from '../services/auditLogs.service';
import { DashboardLayout } from '../components/DashboardLayout';
import { Select } from '../components/ui/select';
import { Pagination } from '../components/ui/pagination';

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
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const viewLogDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setShowModal(true);
  };

  return (
    <DashboardLayout>
      {/* Filters Bar */}
      <div
        className="p-3 mb-4 flex items-center gap-2"
        style={{ backgroundColor: colors.bgSecondary, border: `1px solid ${colors.border}` }}
      >
        <input
          type="text"
          placeholder="Search..."
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          onKeyPress={handleKeyPress}
          className="flex-1 px-3 py-1.5 text-sm focus:outline-none"
          style={{
            backgroundColor: colors.bgPrimary,
            color: colors.textPrimary,
            border: `1px solid ${colors.border}`,
          }}
        />

        <div className="w-[130px]">
          <Select
            value={filter.action}
            onChange={(value) => setFilter({ ...filter, action: value, page: 1 })}
            placeholder="All Actions"
            options={actions.map((action) => ({ value: action, label: action }))}
          />
        </div>

        <div className="w-[140px]">
          <Select
            value={filter.entityType}
            onChange={(value) => setFilter({ ...filter, entityType: value, page: 1 })}
            placeholder="All Types"
            options={entityTypes.map((type) => ({ value: type, label: type }))}
          />
        </div>

        <div className="w-[110px]">
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

        <button
          onClick={handleSearch}
          className="px-4 py-1.5 text-sm font-medium"
          style={{ backgroundColor: colors.primary, color: 'white' }}
        >
          Search
        </button>
      </div>

      {/* Table */}
      <div style={{ border: `1px solid ${colors.border}` }}>
        {/* Table Header */}
        <div
          className="grid grid-cols-12 px-3 py-2"
          style={{
            backgroundColor: colors.bgSecondary,
            borderBottom: `1px solid ${colors.border}`
          }}
        >
          <div className="col-span-2 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
            Timestamp
          </div>
          <div className="col-span-2 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
            User
          </div>
          <div className="col-span-2 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
            Action
          </div>
          <div className="col-span-2 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
            Entity
          </div>
          <div className="col-span-1 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
            Status
          </div>
          <div className="col-span-2 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
            IP Address
          </div>
          <div className="col-span-1 text-xs font-semibold uppercase tracking-wider text-center" style={{ color: colors.textPrimary }}>
            Action
          </div>
        </div>

        {/* Table Body */}
        {loading ? (
          <div className="p-8 text-center text-sm" style={{ color: colors.textMuted }}>
            Loading...
          </div>
        ) : auditLogs.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: colors.textMuted }}>
            No records found
          </div>
        ) : (
          <div>
            {auditLogs.map((log, index) => (
              <div
                key={log.id}
                className="grid grid-cols-12 px-3 py-2.5"
                style={{
                  backgroundColor: index % 2 === 0 ? colors.bgPrimary : colors.bgSecondary,
                  borderBottom: `1px solid ${colors.border}`
                }}
              >
                <div className="col-span-2 text-xs" style={{ color: colors.textSecondary }}>
                  {formatDate(log.createdAt)}
                </div>
                <div className="col-span-2">
                  <div className="text-xs font-medium" style={{ color: colors.textPrimary }}>
                    {log.userName || 'System'}
                  </div>
                  <div className="text-xs" style={{ color: colors.textMuted }}>
                    {log.userEmail || '-'}
                  </div>
                </div>
                <div className="col-span-2 text-xs" style={{ color: colors.textPrimary }}>
                  {log.action}
                </div>
                <div className="col-span-2">
                  <div className="text-xs" style={{ color: colors.textPrimary }}>
                    {log.entityType}
                  </div>
                  {log.entityId && (
                    <div className="text-xs truncate font-mono" style={{ color: colors.textMuted }}>
                      {log.entityId.substring(0, 16)}...
                    </div>
                  )}
                </div>
                <div className="col-span-1">
                  {log.isSuccess ? (
                    <span className="text-xs" style={{ color: colors.primary }}>
                      Success
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: colors.error }}>
                      Failed
                    </span>
                  )}
                </div>
                <div className="col-span-2 text-xs font-mono" style={{ color: colors.textMuted }}>
                  {log.ipAddress || '-'}
                </div>
                <div className="col-span-1 text-center">
                  <button
                    onClick={() => viewLogDetails(log)}
                    className="px-2 py-0.5 text-xs hover:underline"
                    style={{ color: colors.primary }}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: colors.bgPrimary, border: `1px solid ${colors.border}` }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{
                backgroundColor: colors.bgSecondary,
                borderBottom: `1px solid ${colors.border}`
              }}
            >
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
                Audit Log Details
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="px-2 py-1 text-xs hover:underline"
                style={{ color: colors.textMuted }}
              >
                Close
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              {/* Basic Info Grid */}
              <div style={{ border: `1px solid ${colors.border}` }}>
                <div
                  className="px-3 py-2"
                  style={{
                    backgroundColor: colors.bgSecondary,
                    borderBottom: `1px solid ${colors.border}`
                  }}
                >
                  <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
                    Basic Information
                  </h3>
                </div>
                <div className="grid grid-cols-3 px-3 py-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <div className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                    Timestamp
                  </div>
                  <div className="col-span-2 text-xs" style={{ color: colors.textPrimary }}>
                    {formatDate(selectedLog.createdAt)}
                  </div>
                </div>
                <div className="grid grid-cols-3 px-3 py-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <div className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                    User
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs" style={{ color: colors.textPrimary }}>
                      {selectedLog.userName || 'System'}
                    </div>
                    <div className="text-xs" style={{ color: colors.textMuted }}>
                      {selectedLog.userEmail || '-'}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 px-3 py-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <div className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                    Action
                  </div>
                  <div className="col-span-2 text-xs" style={{ color: colors.textPrimary }}>
                    {selectedLog.action}
                  </div>
                </div>
                <div className="grid grid-cols-3 px-3 py-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <div className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                    Entity Type
                  </div>
                  <div className="col-span-2 text-xs" style={{ color: colors.textPrimary }}>
                    {selectedLog.entityType}
                  </div>
                </div>
                <div className="grid grid-cols-3 px-3 py-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <div className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                    Entity ID
                  </div>
                  <div className="col-span-2 text-xs font-mono" style={{ color: colors.textPrimary }}>
                    {selectedLog.entityId || '-'}
                  </div>
                </div>
                <div className="grid grid-cols-3 px-3 py-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <div className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                    Status
                  </div>
                  <div className="col-span-2">
                    {selectedLog.isSuccess ? (
                      <span className="text-xs" style={{ color: colors.primary }}>Success</span>
                    ) : (
                      <span className="text-xs" style={{ color: colors.error }}>Failed</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 px-3 py-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <div className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                    IP Address
                  </div>
                  <div className="col-span-2 text-xs font-mono" style={{ color: colors.textPrimary }}>
                    {selectedLog.ipAddress || '-'}
                  </div>
                </div>
                <div className="grid grid-cols-3 px-3 py-2">
                  <div className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                    User Agent
                  </div>
                  <div className="col-span-2 text-xs break-all" style={{ color: colors.textMuted }}>
                    {selectedLog.userAgent || '-'}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {selectedLog.additionalInfo && (
                <div className="mt-4" style={{ border: `1px solid ${colors.border}` }}>
                  <div
                    className="px-3 py-2"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      borderBottom: `1px solid ${colors.border}`
                    }}
                  >
                    <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
                      Additional Information
                    </h3>
                  </div>
                  <div className="px-3 py-2 text-xs" style={{ color: colors.textPrimary }}>
                    {selectedLog.additionalInfo}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {selectedLog.errorMessage && (
                <div className="mt-4" style={{ border: `1px solid ${colors.border}` }}>
                  <div
                    className="px-3 py-2"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      borderBottom: `1px solid ${colors.border}`
                    }}
                  >
                    <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.error }}>
                      Error Message
                    </h3>
                  </div>
                  <div className="px-3 py-2 text-xs font-mono" style={{ color: colors.error }}>
                    {selectedLog.errorMessage}
                  </div>
                </div>
              )}

              {/* Old Values */}
              {selectedLog.oldValues && (
                <div className="mt-4" style={{ border: `1px solid ${colors.border}` }}>
                  <div
                    className="px-3 py-2"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      borderBottom: `1px solid ${colors.border}`
                    }}
                  >
                    <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
                      Old Values
                    </h3>
                  </div>
                  <pre
                    className="px-3 py-2 text-xs font-mono overflow-x-auto"
                    style={{ color: colors.textPrimary }}
                  >
                    {JSON.stringify(JSON.parse(selectedLog.oldValues), null, 2)}
                  </pre>
                </div>
              )}

              {/* New Values */}
              {selectedLog.newValues && (
                <div className="mt-4" style={{ border: `1px solid ${colors.border}` }}>
                  <div
                    className="px-3 py-2"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      borderBottom: `1px solid ${colors.border}`
                    }}
                  >
                    <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
                      New Values
                    </h3>
                  </div>
                  <pre
                    className="px-3 py-2 text-xs font-mono overflow-x-auto"
                    style={{ color: colors.textPrimary }}
                  >
                    {JSON.stringify(JSON.parse(selectedLog.newValues), null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
