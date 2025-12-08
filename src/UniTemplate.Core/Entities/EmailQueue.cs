namespace UniTemplate.Core.Entities;

public class EmailQueue : BaseEntity
{
    public string ToEmail { get; set; } = string.Empty;
    public string ToName { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public bool IsHtml { get; set; } = true;

    public EmailStatus Status { get; set; } = EmailStatus.Pending;
    public int RetryCount { get; set; } = 0;
    public int MaxRetries { get; set; } = 3;

    public DateTime? ScheduledAt { get; set; }
    public DateTime? SentAt { get; set; }
    public DateTime? FailedAt { get; set; }

    public string? ErrorMessage { get; set; }

    // Reference to the user who triggered the email (if applicable)
    public Guid? TriggeredByUserId { get; set; }
    public string? TriggeredByUserEmail { get; set; }

    // Email type for categorization
    public string EmailType { get; set; } = "General";
}

public enum EmailStatus
{
    Pending = 0,
    Processing = 1,
    Sent = 2,
    Failed = 3,
    Cancelled = 4
}
