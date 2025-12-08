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
}
