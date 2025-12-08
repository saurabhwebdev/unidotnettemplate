using Microsoft.EntityFrameworkCore;
using UniTemplate.Core.DTOs;
using UniTemplate.Core.Entities;
using UniTemplate.Core.Interfaces;
using UniTemplate.Core.Models;

namespace UniTemplate.Data.Services;

public class EmailQueueService : IEmailQueueService
{
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;

    public EmailQueueService(AppDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    public async Task<EmailQueueDto> QueueEmailAsync(CreateEmailQueueDto dto, Guid? triggeredByUserId = null, string? triggeredByUserEmail = null)
    {
        var email = new EmailQueue
        {
            Id = Guid.NewGuid(),
            ToEmail = dto.ToEmail,
            ToName = dto.ToName,
            Subject = dto.Subject,
            Body = dto.Body,
            IsHtml = dto.IsHtml,
            ScheduledAt = dto.ScheduledAt,
            EmailType = dto.EmailType,
            Status = EmailStatus.Pending,
            TriggeredByUserId = triggeredByUserId,
            TriggeredByUserEmail = triggeredByUserEmail
        };

        _context.EmailQueue.Add(email);
        await _context.SaveChangesAsync();

        return MapToDto(email);
    }

    public async Task<PaginatedEmailQueueDto> GetEmailsAsync(EmailQueueFilterDto filter)
    {
        var query = _context.EmailQueue.AsQueryable();

        // Apply filters
        if (!string.IsNullOrEmpty(filter.Status) && Enum.TryParse<EmailStatus>(filter.Status, true, out var status))
        {
            query = query.Where(e => e.Status == status);
        }

        if (!string.IsNullOrEmpty(filter.EmailType))
        {
            query = query.Where(e => e.EmailType == filter.EmailType);
        }

        if (!string.IsNullOrEmpty(filter.SearchTerm))
        {
            var searchTerm = filter.SearchTerm.ToLower();
            query = query.Where(e =>
                e.ToEmail.ToLower().Contains(searchTerm) ||
                e.ToName.ToLower().Contains(searchTerm) ||
                e.Subject.ToLower().Contains(searchTerm));
        }

        if (filter.FromDate.HasValue)
        {
            query = query.Where(e => e.CreatedAt >= filter.FromDate.Value);
        }

        if (filter.ToDate.HasValue)
        {
            query = query.Where(e => e.CreatedAt <= filter.ToDate.Value);
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(e => e.CreatedAt)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        return new PaginatedEmailQueueDto
        {
            Items = items.Select(MapToDto).ToList(),
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        };
    }

    public async Task<EmailQueueDto?> GetEmailByIdAsync(Guid id)
    {
        var email = await _context.EmailQueue.FindAsync(id);
        return email == null ? null : MapToDto(email);
    }

    public async Task<EmailQueueStatsDto> GetStatsAsync()
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);

        var stats = await _context.EmailQueue
            .GroupBy(e => 1)
            .Select(g => new EmailQueueStatsDto
            {
                TotalEmails = g.Count(),
                PendingEmails = g.Count(e => e.Status == EmailStatus.Pending),
                ProcessingEmails = g.Count(e => e.Status == EmailStatus.Processing),
                SentEmails = g.Count(e => e.Status == EmailStatus.Sent),
                FailedEmails = g.Count(e => e.Status == EmailStatus.Failed),
                CancelledEmails = g.Count(e => e.Status == EmailStatus.Cancelled),
                TodaySent = g.Count(e => e.Status == EmailStatus.Sent && e.SentAt >= today && e.SentAt < tomorrow),
                TodayFailed = g.Count(e => e.Status == EmailStatus.Failed && e.FailedAt >= today && e.FailedAt < tomorrow)
            })
            .FirstOrDefaultAsync();

        return stats ?? new EmailQueueStatsDto();
    }

    public async Task<bool> CancelEmailAsync(Guid id)
    {
        var email = await _context.EmailQueue.FindAsync(id);
        if (email == null || email.Status != EmailStatus.Pending)
            return false;

        email.Status = EmailStatus.Cancelled;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RetryEmailAsync(Guid id)
    {
        var email = await _context.EmailQueue.FindAsync(id);
        if (email == null || email.Status != EmailStatus.Failed)
            return false;

        email.Status = EmailStatus.Pending;
        email.RetryCount = 0;
        email.ErrorMessage = null;
        email.FailedAt = null;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<int> ProcessPendingEmailsAsync(int batchSize = 10)
    {
        var now = DateTime.UtcNow;
        var pendingEmails = await _context.EmailQueue
            .Where(e => e.Status == EmailStatus.Pending &&
                       (e.ScheduledAt == null || e.ScheduledAt <= now))
            .OrderBy(e => e.CreatedAt)
            .Take(batchSize)
            .ToListAsync();

        var processedCount = 0;

        foreach (var email in pendingEmails)
        {
            email.Status = EmailStatus.Processing;
            await _context.SaveChangesAsync();

            try
            {
                var emailMessage = new EmailMessage
                {
                    To = new List<string> { email.ToEmail },
                    Subject = email.Subject,
                    Body = email.Body,
                    IsHtml = email.IsHtml
                };

                await _emailService.SendEmailAsync(emailMessage);

                email.Status = EmailStatus.Sent;
                email.SentAt = DateTime.UtcNow;
                processedCount++;
            }
            catch (Exception ex)
            {
                email.RetryCount++;
                email.ErrorMessage = ex.Message;

                if (email.RetryCount >= email.MaxRetries)
                {
                    email.Status = EmailStatus.Failed;
                    email.FailedAt = DateTime.UtcNow;
                }
                else
                {
                    email.Status = EmailStatus.Pending;
                }
            }

            await _context.SaveChangesAsync();
        }

        return processedCount;
    }

    public async Task<bool> DeleteEmailAsync(Guid id)
    {
        var email = await _context.EmailQueue.FindAsync(id);
        if (email == null)
            return false;

        _context.EmailQueue.Remove(email);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<int> ClearOldEmailsAsync(int daysOld = 30)
    {
        var cutoffDate = DateTime.UtcNow.AddDays(-daysOld);
        var oldEmails = await _context.EmailQueue
            .Where(e => e.CreatedAt < cutoffDate &&
                       (e.Status == EmailStatus.Sent || e.Status == EmailStatus.Cancelled))
            .ToListAsync();

        _context.EmailQueue.RemoveRange(oldEmails);
        await _context.SaveChangesAsync();
        return oldEmails.Count;
    }

    private static EmailQueueDto MapToDto(EmailQueue email) => new()
    {
        Id = email.Id,
        ToEmail = email.ToEmail,
        ToName = email.ToName,
        Subject = email.Subject,
        Body = email.Body,
        IsHtml = email.IsHtml,
        Status = email.Status.ToString(),
        RetryCount = email.RetryCount,
        MaxRetries = email.MaxRetries,
        ScheduledAt = email.ScheduledAt,
        SentAt = email.SentAt,
        FailedAt = email.FailedAt,
        ErrorMessage = email.ErrorMessage,
        TriggeredByUserId = email.TriggeredByUserId,
        TriggeredByUserEmail = email.TriggeredByUserEmail,
        EmailType = email.EmailType,
        CreatedAt = email.CreatedAt,
        UpdatedAt = email.UpdatedAt
    };
}
