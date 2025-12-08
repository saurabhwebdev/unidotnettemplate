# Email Configuration Guide

This application supports two email providers:
1. **SMTP** - For general email services (Gmail, SendGrid, Office 365 SMTP, etc.)
2. **Microsoft Graph** - For Azure AD/Microsoft 365 enterprise scenarios

## Quick Start

1. Copy `.env.example` to `.env`
2. Choose your provider and configure the appropriate settings
3. The app will automatically use the correct email service based on `EmailSettings__Provider`

---

## Option 1: SMTP Configuration (Recommended for most scenarios)

### Gmail Configuration

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Create a new app password
3. Configure in `.env`:

```env
EmailSettings__Provider=Smtp
EmailSettings__FromEmail=your-email@gmail.com
EmailSettings__FromName=Your App Name
EmailSettings__Smtp__Host=smtp.gmail.com
EmailSettings__Smtp__Port=587
EmailSettings__Smtp__Username=your-email@gmail.com
EmailSettings__Smtp__Password=your-16-char-app-password
EmailSettings__Smtp__EnableSsl=true
```

### SendGrid Configuration

1. Sign up for SendGrid and create an API key
2. Configure in `.env`:

```env
EmailSettings__Provider=Smtp
EmailSettings__FromEmail=noreply@yourdomain.com
EmailSettings__FromName=Your App Name
EmailSettings__Smtp__Host=smtp.sendgrid.net
EmailSettings__Smtp__Port=587
EmailSettings__Smtp__Username=apikey
EmailSettings__Smtp__Password=your-sendgrid-api-key
EmailSettings__Smtp__EnableSsl=true
```

### Office 365 SMTP Configuration

```env
EmailSettings__Provider=Smtp
EmailSettings__FromEmail=your-email@yourdomain.com
EmailSettings__FromName=Your App Name
EmailSettings__Smtp__Host=smtp.office365.com
EmailSettings__Smtp__Port=587
EmailSettings__Smtp__Username=your-email@yourdomain.com
EmailSettings__Smtp__Password=your-password
EmailSettings__Smtp__EnableSsl=true
```

---

## Option 2: Microsoft Graph Configuration (Enterprise/Azure AD)

### Why Use Microsoft Graph?

- **Enterprise Integration**: Better suited for organizations using Azure AD/Microsoft 365
- **No SMTP Credentials**: Uses Azure AD app authentication instead of email passwords
- **Enterprise Features**: Better tracking, compliance, and integration with Microsoft 365
- **Centralized Management**: Manage permissions through Azure AD

### Setup Steps

#### Step 1: Register App in Azure AD

1. Go to [Azure Portal](https://portal.azure.com) → Azure Active Directory → App registrations
2. Click "New registration"
   - Name: "YourApp Email Service"
   - Supported account types: "Accounts in this organizational directory only"
   - Click "Register"

#### Step 2: Grant Permissions

1. In your app registration, go to "API permissions"
2. Click "Add a permission" → "Microsoft Graph" → "Application permissions"
3. Add these permissions:
   - `Mail.Send` (Send mail as any user)
4. Click "Grant admin consent for [Your Organization]"

#### Step 3: Create Client Secret

1. Go to "Certificates & secrets"
2. Click "New client secret"
3. Add description and expiration
4. **Copy the secret value immediately** (you won't see it again)

#### Step 4: Get Required IDs

- **Tenant ID**: Azure AD → Overview → Tenant ID
- **Client ID**: Your app → Overview → Application (client) ID

#### Step 5: Configure in `.env`

```env
EmailSettings__Provider=MicrosoftGraph
EmailSettings__FromEmail=sender@yourdomain.com
EmailSettings__FromName=Your App Name
EmailSettings__MicrosoftGraph__TenantId=your-tenant-id
EmailSettings__MicrosoftGraph__ClientId=your-client-id
EmailSettings__MicrosoftGraph__ClientSecret=your-client-secret
EmailSettings__MicrosoftGraph__FromEmail=sender@yourdomain.com
```

**Important**: The `FromEmail` must be a valid mailbox in your Microsoft 365 organization.

---

## Environment Variables vs appsettings.json

### Using Environment Variables (Recommended for Production)

Set environment variables with the `__` (double underscore) separator:

```bash
# Linux/Mac
export EmailSettings__Provider="Smtp"
export EmailSettings__Smtp__Host="smtp.gmail.com"

# Windows PowerShell
$env:EmailSettings__Provider="Smtp"
$env:EmailSettings__Smtp__Host="smtp.gmail.com"

# Docker
docker run -e EmailSettings__Provider=Smtp ...
```

### Using appsettings.json (For Development)

Edit `appsettings.Development.json`:

```json
{
  "EmailSettings": {
    "Provider": "Smtp",
    "FromEmail": "noreply@yourdomain.com",
    "FromName": "Your App",
    "Smtp": {
      "Host": "smtp.gmail.com",
      "Port": 587,
      "Username": "your-email@gmail.com",
      "Password": "your-app-password",
      "EnableSsl": true
    }
  }
}
```

---

## Usage in Code

The email service is automatically injected. Use it in your controllers/services:

```csharp
public class YourController : ControllerBase
{
    private readonly IEmailService _emailService;

    public YourController(IEmailService emailService)
    {
        _emailService = emailService;
    }

    public async Task<IActionResult> SendWelcomeEmail(string email, string name)
    {
        await _emailService.SendWelcomeEmailAsync(email, name);
        return Ok();
    }

    public async Task<IActionResult> SendCustomEmail()
    {
        var message = new EmailMessage
        {
            To = new List<string> { "user@example.com" },
            Subject = "Custom Subject",
            Body = "<h1>Hello World</h1>",
            IsHtml = true
        };

        await _emailService.SendEmailAsync(message);
        return Ok();
    }
}
```

---

## Built-in Email Templates

The service includes these pre-built templates:

1. **Welcome Email**: `SendWelcomeEmailAsync(email, userName)`
2. **Password Reset**: `SendPasswordResetEmailAsync(email, resetLink)`
3. **Email Verification**: `SendEmailVerificationAsync(email, verificationLink)`
4. **Custom Email**: `SendEmailAsync(emailMessage)`

---

## Testing Email Configuration

You can test your email setup by calling the email service from any controller or creating a simple test endpoint.

---

## Security Best Practices

1. **Never commit credentials** to source control
2. **Use environment variables** for sensitive data in production
3. **Use App Passwords** for Gmail (not your actual password)
4. **Rotate secrets regularly** in Azure AD
5. **Use Azure Key Vault** for production secrets in Azure
6. **Enable MFA** on service accounts

---

## Troubleshooting

### SMTP Issues

- **Authentication failed**: Check username/password
- **Connection timeout**: Check firewall/network settings
- **Port blocked**: Try port 587 (StartTLS) or 465 (SSL)
- **Gmail "Less secure apps"**: Use App Passwords instead

### Microsoft Graph Issues

- **Unauthorized**: Verify admin consent was granted
- **Forbidden**: Check Mail.Send permission is present
- **Mailbox not found**: Ensure FromEmail is a valid mailbox in your organization
- **Token errors**: Verify Client ID, Secret, and Tenant ID are correct

---

## Production Checklist

- [ ] Email provider configured (`Smtp` or `MicrosoftGraph`)
- [ ] Credentials stored in environment variables (not in code)
- [ ] FromEmail and FromName set appropriately
- [ ] Test emails sending successfully
- [ ] Email templates customized for your brand
- [ ] Error logging configured
- [ ] Rate limiting considered for email sending
- [ ] Secrets rotated and secure
