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
    private readonly AppDbContext _context;

    public AuthController(IAuthService authService, IEmailService emailService, AppDbContext context)
    {
        _authService = authService;
        _emailService = emailService;
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
            return BadRequest(new { message = "User with this email already exists" });
        }

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
            return Unauthorized(new { message = "Invalid email or password" });
        }

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
            return Unauthorized(new { message = "Microsoft login failed" });
        }

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
    public IActionResult GetCurrentUser()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
        var firstName = User.FindFirst(System.Security.Claims.ClaimTypes.GivenName)?.Value;
        var lastName = User.FindFirst(System.Security.Claims.ClaimTypes.Surname)?.Value;

        return Ok(new
        {
            id = userId,
            email,
            firstName,
            lastName
        });
    }

    [Authorize]
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
        var firstName = User.FindFirst(System.Security.Claims.ClaimTypes.GivenName)?.Value;
        var lastName = User.FindFirst(System.Security.Claims.ClaimTypes.Surname)?.Value;

        if (Guid.TryParse(userId, out var userGuid) && !string.IsNullOrEmpty(email))
        {
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
