namespace UniTemplate.Core.Configuration;

public class MicrosoftAuthSettings
{
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string TenantId { get; set; } = "common";
    public string CallbackPath { get; set; } = "/signin-microsoft";
    public bool Enabled => !string.IsNullOrEmpty(ClientId) && !string.IsNullOrEmpty(ClientSecret);
}
