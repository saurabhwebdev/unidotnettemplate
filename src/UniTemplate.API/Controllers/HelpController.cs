using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UniTemplate.Core.DTOs;
using UniTemplate.Core.Interfaces;

namespace UniTemplate.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class HelpController : ControllerBase
{
    private readonly IHelpService _helpService;

    public HelpController(IHelpService helpService)
    {
        _helpService = helpService;
    }

    [HttpGet("sections")]
    public async Task<ActionResult<List<HelpSectionDto>>> GetAllSections()
    {
        var sections = await _helpService.GetAllSectionsAsync();
        return Ok(sections);
    }

    [HttpGet("sections/enabled")]
    public async Task<ActionResult<List<HelpSectionDto>>> GetEnabledSections()
    {
        var sections = await _helpService.GetEnabledSectionsAsync();
        return Ok(sections);
    }

    [HttpGet("sections/{id}")]
    public async Task<ActionResult<HelpSectionDto>> GetSection(Guid id)
    {
        var section = await _helpService.GetSectionByIdAsync(id);
        if (section == null)
            return NotFound(new { message = "Help section not found" });

        return Ok(section);
    }

    [HttpPost("sections")]
    public async Task<ActionResult<HelpSectionDto>> CreateSection([FromBody] CreateHelpSectionDto dto)
    {
        try
        {
            var section = await _helpService.CreateSectionAsync(dto);
            return CreatedAtAction(nameof(GetSection), new { id = section.Id }, section);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("sections/{id}")]
    public async Task<ActionResult<HelpSectionDto>> UpdateSection(Guid id, [FromBody] UpdateHelpSectionDto dto)
    {
        var section = await _helpService.UpdateSectionAsync(id, dto);
        if (section == null)
            return NotFound(new { message = "Help section not found" });

        return Ok(section);
    }

    [HttpDelete("sections/{id}")]
    public async Task<ActionResult> DeleteSection(Guid id)
    {
        var result = await _helpService.DeleteSectionAsync(id);
        if (!result)
            return NotFound(new { message = "Help section not found" });

        return NoContent();
    }

    [HttpGet("topics/{id}")]
    public async Task<ActionResult<HelpTopicDto>> GetTopic(Guid id)
    {
        var topic = await _helpService.GetTopicByIdAsync(id);
        if (topic == null)
            return NotFound(new { message = "Help topic not found" });

        return Ok(topic);
    }

    [HttpPost("topics")]
    public async Task<ActionResult<HelpTopicDto>> CreateTopic([FromBody] CreateHelpTopicDto dto)
    {
        try
        {
            var topic = await _helpService.CreateTopicAsync(dto);
            return CreatedAtAction(nameof(GetTopic), new { id = topic.Id }, topic);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("topics/{id}")]
    public async Task<ActionResult<HelpTopicDto>> UpdateTopic(Guid id, [FromBody] UpdateHelpTopicDto dto)
    {
        var topic = await _helpService.UpdateTopicAsync(id, dto);
        if (topic == null)
            return NotFound(new { message = "Help topic not found" });

        return Ok(topic);
    }

    [HttpDelete("topics/{id}")]
    public async Task<ActionResult> DeleteTopic(Guid id)
    {
        var result = await _helpService.DeleteTopicAsync(id);
        if (!result)
            return NotFound(new { message = "Help topic not found" });

        return NoContent();
    }
}
