using UniTemplate.Core.DTOs;
using UniTemplate.Core.Entities;

namespace UniTemplate.Core.Interfaces;

public interface IEmailQueueService
{
    Task<EmailQueueDto> QueueEmailAsync(CreateEmailQueueDto dto, Guid? triggeredByUserId = null, string? triggeredByUserEmail = null);
    Task<PaginatedEmailQueueDto> GetEmailsAsync(EmailQueueFilterDto filter);
    Task<EmailQueueDto?> GetEmailByIdAsync(Guid id);
    Task<EmailQueueStatsDto> GetStatsAsync();
    Task<bool> CancelEmailAsync(Guid id);
    Task<bool> RetryEmailAsync(Guid id);
    Task<int> ProcessPendingEmailsAsync(int batchSize = 10);
    Task<bool> DeleteEmailAsync(Guid id);
    Task<int> ClearOldEmailsAsync(int daysOld = 30);
}
