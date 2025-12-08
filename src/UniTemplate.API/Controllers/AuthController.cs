using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniTemplate.Core.DTOs.Auth;
using UniTemplate.Core.Enums;
using UniTemplate.Core.Interfaces;
using UniTemplate.Data;

namespace UniTemplate.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IEmailService _emailService;
    private readonly IAuditLogService _auditLogService;
    private readonly AppDbContext _context;

    public AuthController(IAuthService authService, IEmailService emailService, IAuditLogService auditLogService, AppDbContext context)
    {
        _authService = authService;
        _emailService = emailService;
        _auditLogService = auditLogService;
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _authService.RegisterAsync(request);

        if (result == null)
        {
            await _auditLogService.LogActionAsync(null, request.Email, "Register", "User",
                null, null, new { Email = request.Email, FirstName = request.FirstName, LastName = request.LastName },
                GetClientIpAddress(), GetUserAgent(), "Registration failed - email already exists", false, "User with this email already exists");
            return BadRequest(new { message = "User with this email already exists" });
        }

        await _auditLogService.LogActionAsync(result.User.Id, result.User.Email, "Register", "User",
            result.User.Id.ToString(), null, new { Email = result.User.Email, FirstName = result.User.FirstName, LastName = result.User.LastName },
            GetClientIpAddress(), GetUserAgent(), "New user registered successfully");

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _authService.LoginAsync(request);

        if (result == null)
        {
            await _auditLogService.LogActionAsync(null, request.Email, "Login", "User",
                null, null, null, GetClientIpAddress(), GetUserAgent(), "Login failed - invalid credentials", false, "Invalid email or password");
            return Unauthorized(new { message = "Invalid email or password" });
        }

        await _auditLogService.LogActionAsync(result.User.Id, result.User.Email, "Login", "User",
            result.User.Id.ToString(), null, null, GetClientIpAddress(), GetUserAgent(), "User logged in successfully");

        // Send login alert email in background
        _ = Task.Run(async () =>
        {
            try
            {
                var ipAddress = GetClientIpAddress();
                await SendLoginAlertIfEnabled(result.User.Id, result.User.Email, $"{result.User.FirstName} {result.User.LastName}", ipAddress);
            }
            catch
            {
                // Silently fail - don't block login if email fails
            }
        });

        return Ok(result);
    }

    [HttpPost("microsoft-login")]
    public async Task<IActionResult> MicrosoftLogin([FromBody] MicrosoftLoginRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _authService.MicrosoftLoginAsync(request);

        if (result == null)
        {
            await _auditLogService.LogActionAsync(null, request.Email, "MicrosoftLogin", "User",
                null, null, null, GetClientIpAddress(), GetUserAgent(), "Microsoft login failed", false, "Microsoft login failed");
            return Unauthorized(new { message = "Microsoft login failed" });
        }

        await _auditLogService.LogActionAsync(result.User.Id, result.User.Email, "MicrosoftLogin", "User",
            result.User.Id.ToString(), null, null, GetClientIpAddress(), GetUserAgent(), "User logged in via Microsoft SSO");

        // Send login alert email in background
        _ = Task.Run(async () =>
        {
            try
            {
                var ipAddress = GetClientIpAddress();
                await SendLoginAlertIfEnabled(result.User.Id, result.User.Email, $"{result.User.FirstName} {result.User.LastName}", ipAddress);
            }
            catch
            {
                // Silently fail - don't block login if email fails
            }
        });

        return Ok(result);
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _authService.RefreshTokenAsync(request.RefreshToken);

        if (result == null)
        {
            return Unauthorized(new { message = "Invalid or expired refresh token" });
        }

        return Ok(result);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (!Guid.TryParse(userId, out var userGuid))
        {
            return Unauthorized(new { message = "Invalid user" });
        }

        var user = await _context.Users
            .Include(u => u.ReportsTo)
            .FirstOrDefaultAsync(u => u.Id == userGuid);

        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        return Ok(new
        {
            id = user.Id.ToString(),
            email = user.Email,
            firstName = user.FirstName,
            lastName = user.LastName,
            avatarUrl = user.AvatarUrl,
            avatarColor = user.AvatarColor,
            employeeId = user.EmployeeId,
            designation = user.Designation,
            department = user.Department,
            phoneNumber = user.PhoneNumber,
            officeLocation = user.OfficeLocation,
            dateOfJoining = user.DateOfJoining?.ToString("yyyy-MM-dd"),
            reportsToId = user.ReportsToId?.ToString(),
            reportsToName = user.ReportsTo != null ? $"{user.ReportsTo.FirstName} {user.ReportsTo.LastName}" : null
        });
    }

    [Authorize]
    [HttpPut("me")]
    public async Task<IActionResult> UpdateCurrentUser([FromBody] UpdateProfileDto dto)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (!Guid.TryParse(userId, out var userGuid))
        {
            return Unauthorized(new { message = "Invalid user" });
        }

        var user = await _context.Users
            .Include(u => u.ReportsTo)
            .FirstOrDefaultAsync(u => u.Id == userGuid);

        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        // Update editable fields
        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.PhoneNumber = dto.PhoneNumber;
        user.OfficeLocation = dto.OfficeLocation;

        await _context.SaveChangesAsync();

        await _auditLogService.LogActionAsync(userGuid, user.Email, "UpdateProfile", "User",
            userGuid.ToString(), null, new { dto.FirstName, dto.LastName, dto.PhoneNumber, dto.OfficeLocation },
            GetClientIpAddress(), GetUserAgent(), "User updated their profile");

        return Ok(new
        {
            id = user.Id.ToString(),
            email = user.Email,
            firstName = user.FirstName,
            lastName = user.LastName,
            avatarUrl = user.AvatarUrl,
            avatarColor = user.AvatarColor,
            employeeId = user.EmployeeId,
            designation = user.Designation,
            department = user.Department,
            phoneNumber = user.PhoneNumber,
            officeLocation = user.OfficeLocation,
            dateOfJoining = user.DateOfJoining?.ToString("yyyy-MM-dd"),
            reportsToId = user.ReportsToId?.ToString(),
            reportsToName = user.ReportsTo != null ? $"{user.ReportsTo.FirstName} {user.ReportsTo.LastName}" : null
        });
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
        var firstName = User.FindFirst(System.Security.Claims.ClaimTypes.GivenName)?.Value;
        var lastName = User.FindFirst(System.Security.Claims.ClaimTypes.Surname)?.Value;

        if (Guid.TryParse(userId, out var userGuid) && !string.IsNullOrEmpty(email))
        {
            await _auditLogService.LogActionAsync(userGuid, email, "Logout", "User",
                userGuid.ToString(), null, null, GetClientIpAddress(), GetUserAgent(), "User logged out");

            // Send logout alert email in background
            _ = Task.Run(async () =>
            {
                try
                {
                    var ipAddress = GetClientIpAddress();
                    await SendLogoutAlertIfEnabled(userGuid, email, $"{firstName} {lastName}", ipAddress);
                }
                catch
                {
                    // Silently fail - don't block logout if email fails
                }
            });
        }

        return Ok(new { message = "Logged out successfully" });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        await _authService.ForgotPasswordAsync(request);

        return Ok(new { message = "If an account with that email exists, a password reset link has been sent." });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _authService.ResetPasswordAsync(request);

        if (!result)
        {
            return BadRequest(new { message = "Invalid or expired reset token." });
        }

        return Ok(new { message = "Password has been reset successfully." });
    }

    private string GetClientIpAddress()
    {
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();

        // Check for forwarded IP (in case behind proxy/load balancer)
        if (Request.Headers.ContainsKey("X-Forwarded-For"))
        {
            ipAddress = Request.Headers["X-Forwarded-For"].FirstOrDefault()?.Split(',').FirstOrDefault()?.Trim();
        }
        else if (Request.Headers.ContainsKey("X-Real-IP"))
        {
            ipAddress = Request.Headers["X-Real-IP"].FirstOrDefault();
        }

        return ipAddress ?? "Unknown";
    }

    private string? GetUserAgent()
    {
        return Request.Headers["User-Agent"].FirstOrDefault();
    }

    private async Task SendLoginAlertIfEnabled(Guid userId, string email, string userName, string ipAddress)
    {
        var preference = await _context.UserEmailPreferences
            .FirstOrDefaultAsync(p => p.UserId == userId && p.AlertType == EmailAlertType.LoginAlert);

        // If no preference exists or preference is enabled, send the email
        if (preference == null || preference.IsEnabled)
        {
            await _emailService.SendLoginAlertAsync(email, userName, ipAddress, DateTime.UtcNow);
        }
    }

    private async Task SendLogoutAlertIfEnabled(Guid userId, string email, string userName, string ipAddress)
    {
        var preference = await _context.UserEmailPreferences
            .FirstOrDefaultAsync(p => p.UserId == userId && p.AlertType == EmailAlertType.LogoutAlert);

        // If no preference exists or preference is enabled, send the email
        if (preference == null || preference.IsEnabled)
        {
            await _emailService.SendLogoutAlertAsync(email, userName, ipAddress, DateTime.UtcNow);
        }
    }
}
