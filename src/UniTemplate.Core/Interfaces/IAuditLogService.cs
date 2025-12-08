using UniTemplate.Core.DTOs;

namespace UniTemplate.Core.Interfaces;

public interface IAuditLogService
{
    Task<AuditLogPagedResult> GetAuditLogsAsync(AuditLogFilterDto filter);
    Task<AuditLogDto?> GetAuditLogByIdAsync(Guid id);
    Task LogAsync(CreateAuditLogDto dto);
    Task LogActionAsync(Guid? userId, string? userEmail, string action, string entityType, string? entityId = null,
        object? oldValues = null, object? newValues = null, string? ipAddress = null, string? userAgent = null,
        string? additionalInfo = null, bool isSuccess = true, string? errorMessage = null);
    Task<List<string>> GetDistinctActionsAsync();
    Task<List<string>> GetDistinctEntityTypesAsync();
}
