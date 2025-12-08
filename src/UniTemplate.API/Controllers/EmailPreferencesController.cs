using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UniTemplate.Core.Enums;
using UniTemplate.Core.Models;
using UniTemplate.Data;

namespace UniTemplate.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class EmailPreferencesController : ControllerBase
{
    private readonly AppDbContext _context;

    public EmailPreferencesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("alert-types")]
    public IActionResult GetAlertTypes()
    {
        var alertTypes = Enum.GetValues<EmailAlertType>()
            .Select(e => new
            {
                Value = (int)e,
                Name = e.ToString(),
                DisplayName = GetDisplayName(e),
                Description = GetDescription(e)
            })
            .ToList();

        return Ok(alertTypes);
    }

    [HttpGet]
    public async Task<IActionResult> GetPreferences()
    {
        var userId = GetCurrentUserId();

        var preferences = await _context.UserEmailPreferences
            .Where(p => p.UserId == userId)
            .Select(p => new
            {
                p.Id,
                p.AlertType,
                AlertTypeName = p.AlertType.ToString(),
                DisplayName = GetDisplayName(p.AlertType),
                p.IsEnabled
            })
            .ToListAsync();

        // Get all alert types
        var allAlertTypes = Enum.GetValues<EmailAlertType>();

        // For any missing preferences, create default entries
        var existingTypes = preferences.Select(p => p.AlertType).ToHashSet();
        var missingPreferences = allAlertTypes
            .Where(at => !existingTypes.Contains(at))
            .Select(at => new
            {
                Id = Guid.Empty,
                AlertType = at,
                AlertTypeName = at.ToString(),
                DisplayName = GetDisplayName(at),
                IsEnabled = true // Default to enabled
            });

        var allPreferences = preferences.Concat(missingPreferences).OrderBy(p => (int)p.AlertType);

        return Ok(allPreferences);
    }

    [HttpPost]
    public async Task<IActionResult> UpdatePreference([FromBody] UpdatePreferenceRequest request)
    {
        var userId = GetCurrentUserId();

        var preference = await _context.UserEmailPreferences
            .FirstOrDefaultAsync(p => p.UserId == userId && p.AlertType == request.AlertType);

        if (preference == null)
        {
            // Create new preference
            preference = new UserEmailPreference
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                AlertType = request.AlertType,
                IsEnabled = request.IsEnabled,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.UserEmailPreferences.Add(preference);
        }
        else
        {
            // Update existing
            preference.IsEnabled = request.IsEnabled;
            preference.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            preference.Id,
            preference.AlertType,
            AlertTypeName = preference.AlertType.ToString(),
            DisplayName = GetDisplayName(preference.AlertType),
            preference.IsEnabled
        });
    }

    [HttpPost("batch")]
    public async Task<IActionResult> UpdatePreferences([FromBody] List<UpdatePreferenceRequest> requests)
    {
        var userId = GetCurrentUserId();

        foreach (var request in requests)
        {
            var preference = await _context.UserEmailPreferences
                .FirstOrDefaultAsync(p => p.UserId == userId && p.AlertType == request.AlertType);

            if (preference == null)
            {
                preference = new UserEmailPreference
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    AlertType = request.AlertType,
                    IsEnabled = request.IsEnabled,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.UserEmailPreferences.Add(preference);
            }
            else
            {
                preference.IsEnabled = request.IsEnabled;
                preference.UpdatedAt = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Preferences updated successfully" });
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }
        return userId;
    }

    private static string GetDisplayName(EmailAlertType alertType) => alertType switch
    {
        EmailAlertType.LoginAlert => "Login Notifications",
        EmailAlertType.LogoutAlert => "Logout Notifications",
        EmailAlertType.PasswordChanged => "Password Changed",
        EmailAlertType.EmailChanged => "Email Address Changed",
        EmailAlertType.ProfileUpdated => "Profile Updates",
        EmailAlertType.SecurityAlert => "Security Alerts",
        _ => alertType.ToString()
    };

    private static string GetDescription(EmailAlertType alertType) => alertType switch
    {
        EmailAlertType.LoginAlert => "Get notified when someone logs into your account",
        EmailAlertType.LogoutAlert => "Get notified when you log out of your account",
        EmailAlertType.PasswordChanged => "Get notified when your password is changed",
        EmailAlertType.EmailChanged => "Get notified when your email address is changed",
        EmailAlertType.ProfileUpdated => "Get notified when your profile information is updated",
        EmailAlertType.SecurityAlert => "Get notified about important security events",
        _ => "Email notification preference"
    };
}

public class UpdatePreferenceRequest
{
    public EmailAlertType AlertType { get; set; }
    public bool IsEnabled { get; set; }
}
