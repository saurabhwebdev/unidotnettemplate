using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UniTemplate.Core.DTOs;
using UniTemplate.Core.Interfaces;

namespace UniTemplate.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AuditLogsController : ControllerBase
{
    private readonly IAuditLogService _auditLogService;

    public AuditLogsController(IAuditLogService auditLogService)
    {
        _auditLogService = auditLogService;
    }

    [HttpGet]
    public async Task<ActionResult<AuditLogPagedResult>> GetAuditLogs([FromQuery] AuditLogFilterDto filter)
    {
        var result = await _auditLogService.GetAuditLogsAsync(filter);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AuditLogDto>> GetAuditLog(Guid id)
    {
        var auditLog = await _auditLogService.GetAuditLogByIdAsync(id);
        if (auditLog == null)
        {
            return NotFound(new { message = "Audit log not found" });
        }
        return Ok(auditLog);
    }

    [HttpGet("actions")]
    public async Task<ActionResult<List<string>>> GetDistinctActions()
    {
        var actions = await _auditLogService.GetDistinctActionsAsync();
        return Ok(actions);
    }

    [HttpGet("entity-types")]
    public async Task<ActionResult<List<string>>> GetDistinctEntityTypes()
    {
        var entityTypes = await _auditLogService.GetDistinctEntityTypesAsync();
        return Ok(entityTypes);
    }
}
