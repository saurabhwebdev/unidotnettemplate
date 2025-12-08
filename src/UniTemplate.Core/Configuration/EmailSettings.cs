namespace UniTemplate.Core.Configuration;

public class EmailSettings
{
    public string Provider { get; set; } = "Smtp"; // "Smtp" or "MicrosoftGraph"
    public string FromEmail { get; set; } = string.Empty;
    public string FromName { get; set; } = string.Empty;
    public SmtpSettings Smtp { get; set; } = new();
    public MicrosoftGraphSettings MicrosoftGraph { get; set; } = new();
}

public class SmtpSettings
{
    public string Host { get; set; } = string.Empty;
    public int Port { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public bool EnableSsl { get; set; } = true;
}

public class MicrosoftGraphSettings
{
    public string TenantId { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string FromEmail { get; set; } = string.Empty;
}
