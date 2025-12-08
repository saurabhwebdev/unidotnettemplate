using UniTemplate.Core.Models;

namespace UniTemplate.Core.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(EmailMessage message);
    Task SendWelcomeEmailAsync(string toEmail, string userName);
    Task SendPasswordResetEmailAsync(string toEmail, string resetLink);
    Task SendEmailVerificationAsync(string toEmail, string verificationLink);
    Task SendLoginAlertAsync(string toEmail, string userName, string ipAddress, DateTime timestamp);
    Task SendLogoutAlertAsync(string toEmail, string userName, string ipAddress, DateTime timestamp);
    Task SendUserDetailsEmailAsync(string toEmail, string userName, UserDetailsForEmail userDetails);
}

public class UserDetailsForEmail
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? EmployeeId { get; set; }
    public string? Designation { get; set; }
    public string? Department { get; set; }
    public string? PhoneNumber { get; set; }
    public string? OfficeLocation { get; set; }
    public string? DateOfJoining { get; set; }
    public string? ReportsToName { get; set; }
    public List<string> Roles { get; set; } = new();
}
