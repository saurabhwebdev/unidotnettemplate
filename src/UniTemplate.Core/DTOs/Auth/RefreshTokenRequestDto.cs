using System.ComponentModel.DataAnnotations;

namespace UniTemplate.Core.DTOs.Auth;

public class RefreshTokenRequestDto
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}
