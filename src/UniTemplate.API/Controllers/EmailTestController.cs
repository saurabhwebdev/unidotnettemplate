using Microsoft.AspNetCore.Mvc;
using UniTemplate.Core.Interfaces;
using UniTemplate.Core.Models;

namespace UniTemplate.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmailTestController : ControllerBase
{
    private readonly IEmailService _emailService;

    public EmailTestController(IEmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpPost("send-test")]
    public async Task<IActionResult> SendTestEmail([FromBody] TestEmailRequest request)
    {
        try
        {
            var message = new EmailMessage
            {
                To = new List<string> { request.ToEmail },
                Subject = "Test Email from UniTemplate",
                Body = @"
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px; }
                            .content { padding: 20px; background-color: #f9f9f9; margin-top: 20px; border-radius: 5px; }
                        </style>
                    </head>
                    <body>
                        <div class='container'>
                            <div class='header'>
                                <h1>✅ Email Test Successful!</h1>
                            </div>
                            <div class='content'>
                                <p>Congratulations! Your email service is working correctly.</p>
                                <p><strong>Configuration:</strong></p>
                                <ul>
                                    <li>Provider: SMTP (Gmail)</li>
                                    <li>From: worlddj0@gmail.com</li>
                                    <li>Status: Active ✓</li>
                                </ul>
                                <p>You can now use the email service in your application!</p>
                                <p>Best regards,<br>UniTemplate Team</p>
                            </div>
                        </div>
                    </body>
                    </html>
                ",
                IsHtml = true
            };

            await _emailService.SendEmailAsync(message);
            return Ok(new { success = true, message = "Test email sent successfully!" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, error = ex.Message });
        }
    }

    [HttpPost("send-welcome")]
    public async Task<IActionResult> SendWelcomeEmail([FromBody] WelcomeEmailRequest request)
    {
        try
        {
            await _emailService.SendWelcomeEmailAsync(request.ToEmail, request.UserName);
            return Ok(new { success = true, message = "Welcome email sent successfully!" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, error = ex.Message });
        }
    }

    [HttpPost("send-password-reset")]
    public async Task<IActionResult> SendPasswordResetEmail([FromBody] PasswordResetRequest request)
    {
        try
        {
            await _emailService.SendPasswordResetEmailAsync(request.ToEmail, request.ResetLink);
            return Ok(new { success = true, message = "Password reset email sent successfully!" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, error = ex.Message });
        }
    }

    [HttpPost("send-verification")]
    public async Task<IActionResult> SendVerificationEmail([FromBody] VerificationEmailRequest request)
    {
        try
        {
            await _emailService.SendEmailVerificationAsync(request.ToEmail, request.VerificationLink);
            return Ok(new { success = true, message = "Verification email sent successfully!" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, error = ex.Message });
        }
    }
}

public class TestEmailRequest
{
    public string ToEmail { get; set; } = string.Empty;
}

public class WelcomeEmailRequest
{
    public string ToEmail { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
}

public class PasswordResetRequest
{
    public string ToEmail { get; set; } = string.Empty;
    public string ResetLink { get; set; } = string.Empty;
}

public class VerificationEmailRequest
{
    public string ToEmail { get; set; } = string.Empty;
    public string VerificationLink { get; set; } = string.Empty;
}
