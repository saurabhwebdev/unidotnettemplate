using System.ComponentModel.DataAnnotations;

namespace UniTemplate.Core.DTOs.Auth;

public class UpdateProfileDto
{
    [Required]
    [StringLength(50)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string LastName { get; set; } = string.Empty;

    [StringLength(20)]
    public string? PhoneNumber { get; set; }

    [StringLength(100)]
    public string? OfficeLocation { get; set; }
}
