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

    public UsersController(IUserService userService, IEmailService emailService)
    {
        _userService = userService;
        _emailService = emailService;
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

            return Ok(new { message = "User details email sent successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Failed to send email: {ex.Message}" });
        }
    }
}
