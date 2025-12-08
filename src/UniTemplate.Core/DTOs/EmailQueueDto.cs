using UniTemplate.Core.Entities;

namespace UniTemplate.Core.DTOs;

public class EmailQueueDto
{
    public Guid Id { get; set; }
    public string ToEmail { get; set; } = string.Empty;
    public string ToName { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public bool IsHtml { get; set; }

    public string Status { get; set; } = string.Empty;
    public int RetryCount { get; set; }
    public int MaxRetries { get; set; }

    public DateTime? ScheduledAt { get; set; }
    public DateTime? SentAt { get; set; }
    public DateTime? FailedAt { get; set; }

    public string? ErrorMessage { get; set; }

    public Guid? TriggeredByUserId { get; set; }
    public string? TriggeredByUserEmail { get; set; }

    public string EmailType { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateEmailQueueDto
{
    public string ToEmail { get; set; } = string.Empty;
    public string ToName { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public bool IsHtml { get; set; } = true;
    public DateTime? ScheduledAt { get; set; }
    public string EmailType { get; set; } = "General";
}

public class EmailQueueStatsDto
{
    public int TotalEmails { get; set; }
    public int PendingEmails { get; set; }
    public int ProcessingEmails { get; set; }
    public int SentEmails { get; set; }
    public int FailedEmails { get; set; }
    public int CancelledEmails { get; set; }
    public int TodaySent { get; set; }
    public int TodayFailed { get; set; }
}

public class EmailQueueFilterDto
{
    public string? Status { get; set; }
    public string? EmailType { get; set; }
    public string? SearchTerm { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class PaginatedEmailQueueDto
{
    public List<EmailQueueDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}
