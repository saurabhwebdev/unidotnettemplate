using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UniTemplate.Core.DTOs;
using UniTemplate.Core.Interfaces;

namespace UniTemplate.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IEmailService _emailService;
    private readonly IAuditLogService _auditLogService;

    public UsersController(IUserService userService, IEmailService emailService, IAuditLogService auditLogService)
    {
        _userService = userService;
        _emailService = emailService;
        _auditLogService = auditLogService;
    }

    private string GetClientIpAddress()
    {
        return HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
    }

    private string GetUserAgent()
    {
        return Request.Headers["User-Agent"].ToString();
    }

    [HttpGet]
    public async Task<ActionResult<List<UserDto>>> GetAllUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(Guid id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null)
            return NotFound(new { message = "User not found" });

        return Ok(user);
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto dto)
    {
        try
        {
            var user = await _userService.CreateUserAsync(dto);
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<UserDto>> UpdateUser(Guid id, [FromBody] UpdateUserDto dto)
    {
        var user = await _userService.UpdateUserAsync(id, dto);
        if (user == null)
            return NotFound(new { message = "User not found" });

        return Ok(user);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteUser(Guid id)
    {
        var result = await _userService.DeleteUserAsync(id);
        if (!result)
            return NotFound(new { message = "User not found" });

        return NoContent();
    }

    [HttpPost("{id}/roles")]
    public async Task<ActionResult<UserDto>> AssignRoles(Guid id, [FromBody] AssignRolesDto dto)
    {
        var user = await _userService.AssignRolesToUserAsync(id, dto);
        if (user == null)
            return NotFound(new { message = "User not found" });

        return Ok(user);
    }

    [HttpPut("{id}/avatar")]
    public async Task<ActionResult<UserDto>> UpdateAvatar(Guid id, [FromBody] UpdateAvatarDto dto)
    {
        var user = await _userService.UpdateAvatarAsync(id, dto);
        if (user == null)
            return NotFound(new { message = "User not found" });

        return Ok(user);
    }

    [HttpPost("{id}/send-details")]
    public async Task<ActionResult> SendUserDetails(Guid id)
    {
        var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var currentUserEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
        Guid? triggeredByUserId = Guid.TryParse(currentUserId, out var parsedId) ? parsedId : null;

        var user = await _userService.GetUserByIdAsync(id);
        if (user == null)
            return NotFound(new { message = "User not found" });

        try
        {
            var userDetails = new UserDetailsForEmail
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                EmployeeId = user.EmployeeId,
                Designation = user.Designation,
                Department = user.Department,
                PhoneNumber = user.PhoneNumber,
                OfficeLocation = user.OfficeLocation,
                DateOfJoining = user.DateOfJoining?.ToString("yyyy-MM-dd"),
                ReportsToName = user.ReportsToName,
                Roles = user.Roles.Select(r => r.Name).ToList()
            };

            await _emailService.SendUserDetailsEmailAsync(
                user.Email,
                $"{user.FirstName} {user.LastName}",
                userDetails
            );

            // Log email sent to audit log
            await _auditLogService.LogActionAsync(
                triggeredByUserId,
                currentUserEmail ?? "System",
                "EmailSent",
                "Email",
                user.Id.ToString(),
                null,
                new { EmailType = "UserDetails", ToEmail = user.Email, ToName = $"{user.FirstName} {user.LastName}", Subject = "Your Account Details" },
                GetClientIpAddress(),
                GetUserAgent(),
                $"User details email sent to {user.Email}"
            );

            return Ok(new { message = "User details email sent successfully" });
        }
        catch (Exception ex)
        {
            // Log email failure to audit log
            await _auditLogService.LogActionAsync(
                triggeredByUserId,
                currentUserEmail ?? "System",
                "EmailFailed",
                "Email",
                user.Id.ToString(),
                null,
                new { EmailType = "UserDetails", ToEmail = user.Email, ToName = $"{user.FirstName} {user.LastName}", Error = ex.Message },
                GetClientIpAddress(),
                GetUserAgent(),
                $"Failed to send user details email to {user.Email}",
                false,
                ex.Message
            );

            return BadRequest(new { message = $"Failed to send email: {ex.Message}" });
        }
    }
}
