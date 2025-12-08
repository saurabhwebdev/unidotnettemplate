using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using UniTemplate.Core.DTOs;
using UniTemplate.Core.Entities;
using UniTemplate.Core.Interfaces;

namespace UniTemplate.Data.Services;

public class AuditLogService : IAuditLogService
{
    private readonly AppDbContext _context;

    public AuditLogService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<AuditLogPagedResult> GetAuditLogsAsync(AuditLogFilterDto filter)
    {
        var query = _context.AuditLogs
            .Include(a => a.User)
            .AsQueryable();

        // Apply filters
        if (filter.UserId.HasValue)
        {
            query = query.Where(a => a.UserId == filter.UserId.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.Action))
        {
            query = query.Where(a => a.Action == filter.Action);
        }

        if (!string.IsNullOrWhiteSpace(filter.EntityType))
        {
            query = query.Where(a => a.EntityType == filter.EntityType);
        }

        if (filter.FromDate.HasValue)
        {
            query = query.Where(a => a.CreatedAt >= filter.FromDate.Value);
        }

        if (filter.ToDate.HasValue)
        {
            query = query.Where(a => a.CreatedAt <= filter.ToDate.Value);
        }

        if (filter.IsSuccess.HasValue)
        {
            query = query.Where(a => a.IsSuccess == filter.IsSuccess.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.ToLower();
            query = query.Where(a =>
                (a.UserEmail != null && a.UserEmail.ToLower().Contains(search)) ||
                a.Action.ToLower().Contains(search) ||
                a.EntityType.ToLower().Contains(search) ||
                (a.EntityId != null && a.EntityId.ToLower().Contains(search)) ||
                (a.AdditionalInfo != null && a.AdditionalInfo.ToLower().Contains(search)));
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(a => new AuditLogDto
            {
                Id = a.Id,
                UserId = a.UserId,
                UserEmail = a.UserEmail,
                UserName = a.User != null ? $"{a.User.FirstName} {a.User.LastName}" : null,
                Action = a.Action,
                EntityType = a.EntityType,
                EntityId = a.EntityId,
                OldValues = a.OldValues,
                NewValues = a.NewValues,
                IpAddress = a.IpAddress,
                UserAgent = a.UserAgent,
                AdditionalInfo = a.AdditionalInfo,
                IsSuccess = a.IsSuccess,
                ErrorMessage = a.ErrorMessage,
                CreatedAt = a.CreatedAt
            })
            .ToListAsync();

        return new AuditLogPagedResult
        {
            Items = items,
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        };
    }

    public async Task<AuditLogDto?> GetAuditLogByIdAsync(Guid id)
    {
        return await _context.AuditLogs
            .Include(a => a.User)
            .Where(a => a.Id == id)
            .Select(a => new AuditLogDto
            {
                Id = a.Id,
                UserId = a.UserId,
                UserEmail = a.UserEmail,
                UserName = a.User != null ? $"{a.User.FirstName} {a.User.LastName}" : null,
                Action = a.Action,
                EntityType = a.EntityType,
                EntityId = a.EntityId,
                OldValues = a.OldValues,
                NewValues = a.NewValues,
                IpAddress = a.IpAddress,
                UserAgent = a.UserAgent,
                AdditionalInfo = a.AdditionalInfo,
                IsSuccess = a.IsSuccess,
                ErrorMessage = a.ErrorMessage,
                CreatedAt = a.CreatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task LogAsync(CreateAuditLogDto dto)
    {
        var auditLog = new AuditLog
        {
            UserId = dto.UserId,
            UserEmail = dto.UserEmail,
            Action = dto.Action,
            EntityType = dto.EntityType,
            EntityId = dto.EntityId,
            OldValues = dto.OldValues,
            NewValues = dto.NewValues,
            IpAddress = dto.IpAddress,
            UserAgent = dto.UserAgent,
            AdditionalInfo = dto.AdditionalInfo,
            IsSuccess = dto.IsSuccess,
            ErrorMessage = dto.ErrorMessage
        };

        _context.AuditLogs.Add(auditLog);
        await _context.SaveChangesAsync();
    }

    public async Task LogActionAsync(Guid? userId, string? userEmail, string action, string entityType,
        string? entityId = null, object? oldValues = null, object? newValues = null,
        string? ipAddress = null, string? userAgent = null, string? additionalInfo = null,
        bool isSuccess = true, string? errorMessage = null)
    {
        var dto = new CreateAuditLogDto
        {
            UserId = userId,
            UserEmail = userEmail,
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            OldValues = oldValues != null ? JsonSerializer.Serialize(oldValues) : null,
            NewValues = newValues != null ? JsonSerializer.Serialize(newValues) : null,
            IpAddress = ipAddress,
            UserAgent = userAgent,
            AdditionalInfo = additionalInfo,
            IsSuccess = isSuccess,
            ErrorMessage = errorMessage
        };

        await LogAsync(dto);
    }

    public async Task<List<string>> GetDistinctActionsAsync()
    {
        return await _context.AuditLogs
            .Select(a => a.Action)
            .Distinct()
            .OrderBy(a => a)
            .ToListAsync();
    }

    public async Task<List<string>> GetDistinctEntityTypesAsync()
    {
        return await _context.AuditLogs
            .Select(a => a.EntityType)
            .Distinct()
            .OrderBy(a => a)
            .ToListAsync();
    }
}
