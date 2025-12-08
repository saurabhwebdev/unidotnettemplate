using Azure.Identity;
using Microsoft.Extensions.Options;
using Microsoft.Graph;
using Microsoft.Graph.Models;
using Microsoft.Graph.Users.Item.SendMail;
using UniTemplate.Core.Interfaces;
using UniTemplate.Core.Models;
using CoreEmailSettings = UniTemplate.Core.Configuration.EmailSettings;

namespace UniTemplate.Data.Services;

public class MicrosoftGraphEmailService : IEmailService
{
    private readonly CoreEmailSettings _emailSettings;
    private readonly GraphServiceClient _graphClient;

    public MicrosoftGraphEmailService(IOptions<CoreEmailSettings> emailSettings)
    {
        _emailSettings = emailSettings.Value;

        var options = new ClientSecretCredentialOptions
        {
            AuthorityHost = AzureAuthorityHosts.AzurePublicCloud
        };

        var clientSecretCredential = new ClientSecretCredential(
            _emailSettings.MicrosoftGraph.TenantId,
            _emailSettings.MicrosoftGraph.ClientId,
            _emailSettings.MicrosoftGraph.ClientSecret,
            options
        );

        _graphClient = new GraphServiceClient(clientSecretCredential);
    }

    public async Task SendEmailAsync(EmailMessage message)
    {
        try
        {
            var graphMessage = CreateGraphMessage(message);

            var sendMailBody = new SendMailPostRequestBody
            {
                Message = graphMessage,
                SaveToSentItems = true
            };

            var fromEmail = !string.IsNullOrEmpty(_emailSettings.MicrosoftGraph.FromEmail)
                ? _emailSettings.MicrosoftGraph.FromEmail
                : _emailSettings.FromEmail;

            await _graphClient.Users[fromEmail].SendMail.PostAsync(sendMailBody);
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed to send email via Microsoft Graph: {ex.Message}", ex);
        }
    }

    public async Task SendWelcomeEmailAsync(string toEmail, string userName)
    {
        var message = new EmailMessage
        {
            To = new List<string> { toEmail },
            Subject = "Welcome to UniTemplate!",
            Body = GetWelcomeEmailBody(userName),
            IsHtml = true
        };

        await SendEmailAsync(message);
    }

    public async Task SendPasswordResetEmailAsync(string toEmail, string resetLink)
    {
        var message = new EmailMessage
        {
            To = new List<string> { toEmail },
            Subject = "Reset Your Password",
            Body = GetPasswordResetEmailBody(resetLink),
            IsHtml = true
        };

        await SendEmailAsync(message);
    }

    public async Task SendEmailVerificationAsync(string toEmail, string verificationLink)
    {
        var message = new EmailMessage
        {
            To = new List<string> { toEmail },
            Subject = "Verify Your Email Address",
            Body = GetEmailVerificationBody(verificationLink),
            IsHtml = true
        };

        await SendEmailAsync(message);
    }

    public async Task SendLoginAlertAsync(string toEmail, string userName, string ipAddress, DateTime timestamp)
    {
        var message = new EmailMessage
        {
            To = new List<string> { toEmail },
            Subject = "New Login to Your Account",
            Body = GetLoginAlertBody(userName, ipAddress, timestamp),
            IsHtml = true
        };

        await SendEmailAsync(message);
    }

    public async Task SendLogoutAlertAsync(string toEmail, string userName, string ipAddress, DateTime timestamp)
    {
        var message = new EmailMessage
        {
            To = new List<string> { toEmail },
            Subject = "Logout from Your Account",
            Body = GetLogoutAlertBody(userName, ipAddress, timestamp),
            IsHtml = true
        };

        await SendEmailAsync(message);
    }

    private Message CreateGraphMessage(EmailMessage message)
    {
        var graphMessage = new Message
        {
            Subject = message.Subject,
            Body = new ItemBody
            {
                ContentType = message.IsHtml ? BodyType.Html : BodyType.Text,
                Content = message.Body
            },
            ToRecipients = message.To.Select(email => new Recipient
            {
                EmailAddress = new EmailAddress { Address = email }
            }).ToList()
        };

        if (message.Cc != null && message.Cc.Any())
        {
            graphMessage.CcRecipients = message.Cc.Select(email => new Recipient
            {
                EmailAddress = new EmailAddress { Address = email }
            }).ToList();
        }

        if (message.Bcc != null && message.Bcc.Any())
        {
            graphMessage.BccRecipients = message.Bcc.Select(email => new Recipient
            {
                EmailAddress = new EmailAddress { Address = email }
            }).ToList();
        }

        if (message.Attachments != null && message.Attachments.Any())
        {
            graphMessage.Attachments = message.Attachments.Select(att => new FileAttachment
            {
                Name = att.FileName,
                ContentBytes = att.Content,
                ContentType = att.ContentType
            } as Attachment).ToList();
        }

        return graphMessage;
    }

    private string GetWelcomeEmailBody(string userName)
    {
        return $@"
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #4F46E5; color: white; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; background-color: #f9f9f9; }}
                    .button {{ display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>Welcome to UniTemplate!</h1>
                    </div>
                    <div class='content'>
                        <p>Hi {userName},</p>
                        <p>Welcome to UniTemplate! We're excited to have you on board.</p>
                        <p>Your account has been successfully created. You can now access all features of our platform.</p>
                        <p>If you have any questions, feel free to reach out to our support team.</p>
                        <p>Best regards,<br>The UniTemplate Team</p>
                    </div>
                </div>
            </body>
            </html>
        ";
    }

    private string GetPasswordResetEmailBody(string resetLink)
    {
        return $@"
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #4F46E5; color: white; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; background-color: #f9f9f9; }}
                    .button {{ display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px; }}
                    .warning {{ color: #dc2626; font-size: 12px; margin-top: 20px; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>Password Reset Request</h1>
                    </div>
                    <div class='content'>
                        <p>We received a request to reset your password.</p>
                        <p>Click the button below to reset your password:</p>
                        <p><a href='{resetLink}' class='button'>Reset Password</a></p>
                        <p class='warning'>This link will expire in 24 hours. If you didn't request this, please ignore this email.</p>
                        <p>Best regards,<br>The UniTemplate Team</p>
                    </div>
                </div>
            </body>
            </html>
        ";
    }

    private string GetEmailVerificationBody(string verificationLink)
    {
        return $@"
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #4F46E5; color: white; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; background-color: #f9f9f9; }}
                    .button {{ display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>Verify Your Email</h1>
                    </div>
                    <div class='content'>
                        <p>Thank you for registering with UniTemplate!</p>
                        <p>Please verify your email address by clicking the button below:</p>
                        <p><a href='{verificationLink}' class='button'>Verify Email</a></p>
                        <p>If you didn't create an account, you can safely ignore this email.</p>
                        <p>Best regards,<br>The UniTemplate Team</p>
                    </div>
                </div>
            </body>
            </html>
        ";
    }

    private string GetLoginAlertBody(string userName, string ipAddress, DateTime timestamp)
    {
        return $@"
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #3cca70; color: white; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; background-color: #f9f9f9; }}
                    .info-box {{ background-color: #ffffff; padding: 15px; border-left: 4px solid #3cca70; margin: 15px 0; }}
                    .info-row {{ margin: 10px 0; }}
                    .label {{ font-weight: bold; color: #555; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>🔐 New Login Detected</h1>
                    </div>
                    <div class='content'>
                        <p>Hi {userName},</p>
                        <p>We detected a new login to your account. Here are the details:</p>
                        <div class='info-box'>
                            <div class='info-row'>
                                <span class='label'>IP Address:</span> {ipAddress}
                            </div>
                            <div class='info-row'>
                                <span class='label'>Timestamp:</span> {timestamp:yyyy-MM-dd HH:mm:ss} UTC
                            </div>
                        </div>
                        <p>If this was you, you can safely ignore this email.</p>
                        <p>If you did not perform this login, please secure your account immediately and contact support.</p>
                        <p>Best regards,<br>The UniTemplate Team</p>
                    </div>
                </div>
            </body>
            </html>
        ";
    }

    private string GetLogoutAlertBody(string userName, string ipAddress, DateTime timestamp)
    {
        return $@"
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #f59e0b; color: white; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; background-color: #f9f9f9; }}
                    .info-box {{ background-color: #ffffff; padding: 15px; border-left: 4px solid #f59e0b; margin: 15px 0; }}
                    .info-row {{ margin: 10px 0; }}
                    .label {{ font-weight: bold; color: #555; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>👋 Logout Notification</h1>
                    </div>
                    <div class='content'>
                        <p>Hi {userName},</p>
                        <p>You have been logged out of your account. Here are the details:</p>
                        <div class='info-box'>
                            <div class='info-row'>
                                <span class='label'>IP Address:</span> {ipAddress}
                            </div>
                            <div class='info-row'>
                                <span class='label'>Timestamp:</span> {timestamp:yyyy-MM-dd HH:mm:ss} UTC
                            </div>
                        </div>
                        <p>If you did not perform this logout, please secure your account immediately.</p>
                        <p>Best regards,<br>The UniTemplate Team</p>
                    </div>
                </div>
            </body>
            </html>
        ";
    }

    public async Task SendUserDetailsEmailAsync(string toEmail, string userName, UserDetailsForEmail userDetails)
    {
        var message = new EmailMessage
        {
            To = new List<string> { toEmail },
            Subject = "Your Account Details",
            Body = GetUserDetailsEmailBody(userName, userDetails),
            IsHtml = true
        };

        await SendEmailAsync(message);
    }

    private string GetUserDetailsEmailBody(string userName, UserDetailsForEmail details)
    {
        var rolesHtml = details.Roles.Any()
            ? string.Join("", details.Roles.Select(r => $"<span style='display:inline-block;background-color:#4F46E5;color:white;padding:4px 12px;border-radius:15px;font-size:12px;margin:2px;'>{r}</span>"))
            : "<span style='color:#666;'>No roles assigned</span>";

        return $@"
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }}
                    .header h1 {{ margin: 0; font-size: 24px; }}
                    .content {{ padding: 30px; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }}
                    .section {{ margin-bottom: 25px; }}
                    .section-title {{ font-size: 14px; font-weight: bold; color: #4F46E5; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb; }}
                    .info-grid {{ display: table; width: 100%; }}
                    .info-row {{ display: table-row; }}
                    .info-label {{ display: table-cell; padding: 8px 15px 8px 0; font-weight: 600; color: #555; width: 140px; vertical-align: top; }}
                    .info-value {{ display: table-cell; padding: 8px 0; color: #333; }}
                    .avatar {{ width: 80px; height: 80px; border-radius: 50%; background-color: #4F46E5; color: white; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; margin: 0 auto 15px; text-align: center; line-height: 80px; }}
                    .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
                    .roles-container {{ margin-top: 5px; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <div class='avatar'>{details.FirstName[0]}{details.LastName[0]}</div>
                        <h1>Your Account Details</h1>
                    </div>
                    <div class='content'>
                        <p>Hi {userName},</p>
                        <p>Here are your current account details:</p>

                        <div class='section'>
                            <div class='section-title'>Personal Information</div>
                            <div class='info-grid'>
                                <div class='info-row'>
                                    <div class='info-label'>Full Name</div>
                                    <div class='info-value'>{details.FirstName} {details.LastName}</div>
                                </div>
                                <div class='info-row'>
                                    <div class='info-label'>Email</div>
                                    <div class='info-value'>{details.Email}</div>
                                </div>
                                {(!string.IsNullOrEmpty(details.PhoneNumber) ? $@"
                                <div class='info-row'>
                                    <div class='info-label'>Phone</div>
                                    <div class='info-value'>{details.PhoneNumber}</div>
                                </div>" : "")}
                            </div>
                        </div>

                        <div class='section'>
                            <div class='section-title'>Employee Information</div>
                            <div class='info-grid'>
                                {(!string.IsNullOrEmpty(details.EmployeeId) ? $@"
                                <div class='info-row'>
                                    <div class='info-label'>Employee ID</div>
                                    <div class='info-value'>{details.EmployeeId}</div>
                                </div>" : "")}
                                {(!string.IsNullOrEmpty(details.Designation) ? $@"
                                <div class='info-row'>
                                    <div class='info-label'>Designation</div>
                                    <div class='info-value'>{details.Designation}</div>
                                </div>" : "")}
                                {(!string.IsNullOrEmpty(details.Department) ? $@"
                                <div class='info-row'>
                                    <div class='info-label'>Department</div>
                                    <div class='info-value'>{details.Department}</div>
                                </div>" : "")}
                                {(!string.IsNullOrEmpty(details.OfficeLocation) ? $@"
                                <div class='info-row'>
                                    <div class='info-label'>Office Location</div>
                                    <div class='info-value'>{details.OfficeLocation}</div>
                                </div>" : "")}
                                {(!string.IsNullOrEmpty(details.DateOfJoining) ? $@"
                                <div class='info-row'>
                                    <div class='info-label'>Date of Joining</div>
                                    <div class='info-value'>{details.DateOfJoining}</div>
                                </div>" : "")}
                                {(!string.IsNullOrEmpty(details.ReportsToName) ? $@"
                                <div class='info-row'>
                                    <div class='info-label'>Reports To</div>
                                    <div class='info-value'>{details.ReportsToName}</div>
                                </div>" : "")}
                            </div>
                        </div>

                        <div class='section'>
                            <div class='section-title'>Assigned Roles</div>
                            <div class='roles-container'>
                                {rolesHtml}
                            </div>
                        </div>

                        <p style='margin-top: 25px;'>If any of this information is incorrect, please contact your administrator.</p>
                        <p>Best regards,<br>The UniTemplate Team</p>
                    </div>
                    <div class='footer'>
                        This is an automated message from UniTemplate. Please do not reply to this email.
                    </div>
                </div>
            </body>
            </html>
        ";
    }
}
