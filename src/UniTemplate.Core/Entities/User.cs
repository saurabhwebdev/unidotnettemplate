namespace UniTemplate.Core.Entities;

public class User : BaseEntity
{
    // Basic Information
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? AvatarColor { get; set; }
    public bool IsActive { get; set; } = true;

    // Enterprise/Employee Information
    public string? EmployeeId { get; set; }
    public string? Designation { get; set; }
    public string? Department { get; set; }
    public string? PhoneNumber { get; set; }
    public string? OfficeLocation { get; set; }
    public DateTime? DateOfJoining { get; set; }
    public Guid? ReportsToId { get; set; }

    // Authentication tokens
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }

    // Navigation properties
    public User? ReportsTo { get; set; }
    public ICollection<User> DirectReports { get; set; } = new List<User>();
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
