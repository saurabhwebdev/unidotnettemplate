using System.ComponentModel.DataAnnotations;

namespace UniTemplate.Core.DTOs.Auth;

public class MicrosoftLoginRequestDto
{
    [Required]
    public string AccessToken { get; set; } = string.Empty;

    public string? Email { get; set; }
    public string? Name { get; set; }
}
