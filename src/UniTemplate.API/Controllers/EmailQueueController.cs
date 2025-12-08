using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UniTemplate.Core.DTOs;
using UniTemplate.Core.Interfaces;

namespace UniTemplate.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class EmailQueueController : ControllerBase
{
    private readonly IEmailQueueService _emailQueueService;

    public EmailQueueController(IEmailQueueService emailQueueService)
    {
        _emailQueueService = emailQueueService;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedEmailQueueDto>> GetEmails([FromQuery] EmailQueueFilterDto filter)
    {
        var result = await _emailQueueService.GetEmailsAsync(filter);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EmailQueueDto>> GetEmail(Guid id)
    {
        var email = await _emailQueueService.GetEmailByIdAsync(id);
        if (email == null)
            return NotFound(new { message = "Email not found" });

        return Ok(email);
    }

    [HttpGet("stats")]
    public async Task<ActionResult<EmailQueueStatsDto>> GetStats()
    {
        var stats = await _emailQueueService.GetStatsAsync();
        return Ok(stats);
    }

    [HttpPost]
    public async Task<ActionResult<EmailQueueDto>> QueueEmail([FromBody] CreateEmailQueueDto dto)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var userEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;

        Guid? triggeredByUserId = null;
        if (Guid.TryParse(userId, out var parsedUserId))
        {
            triggeredByUserId = parsedUserId;
        }

        var email = await _emailQueueService.QueueEmailAsync(dto, triggeredByUserId, userEmail);
        return CreatedAtAction(nameof(GetEmail), new { id = email.Id }, email);
    }

    [HttpPost("{id}/cancel")]
    public async Task<ActionResult> CancelEmail(Guid id)
    {
        var result = await _emailQueueService.CancelEmailAsync(id);
        if (!result)
            return BadRequest(new { message = "Cannot cancel this email. It may have already been sent or is not in pending status." });

        return Ok(new { message = "Email cancelled successfully" });
    }

    [HttpPost("{id}/retry")]
    public async Task<ActionResult> RetryEmail(Guid id)
    {
        var result = await _emailQueueService.RetryEmailAsync(id);
        if (!result)
            return BadRequest(new { message = "Cannot retry this email. It may not be in failed status." });

        return Ok(new { message = "Email queued for retry successfully" });
    }

    [HttpPost("process")]
    public async Task<ActionResult> ProcessPendingEmails([FromQuery] int batchSize = 10)
    {
        var processedCount = await _emailQueueService.ProcessPendingEmailsAsync(batchSize);
        return Ok(new { message = $"Processed {processedCount} emails", processedCount });
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteEmail(Guid id)
    {
        var result = await _emailQueueService.DeleteEmailAsync(id);
        if (!result)
            return NotFound(new { message = "Email not found" });

        return Ok(new { message = "Email deleted successfully" });
    }

    [HttpDelete("clear-old")]
    public async Task<ActionResult> ClearOldEmails([FromQuery] int daysOld = 30)
    {
        var deletedCount = await _emailQueueService.ClearOldEmailsAsync(daysOld);
        return Ok(new { message = $"Deleted {deletedCount} old emails", deletedCount });
    }
}
