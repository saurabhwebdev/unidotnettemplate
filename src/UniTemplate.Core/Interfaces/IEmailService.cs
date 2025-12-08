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
}
