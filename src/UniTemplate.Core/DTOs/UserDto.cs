namespace UniTemplate.Core.DTOs;

public class UserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? AvatarColor { get; set; }
    public bool IsActive { get; set; }

    // Enterprise/Employee Information
    public string? EmployeeId { get; set; }
    public string? Designation { get; set; }
    public string? Department { get; set; }
    public string? PhoneNumber { get; set; }
    public string? OfficeLocation { get; set; }
    public DateTime? DateOfJoining { get; set; }
    public Guid? ReportsToId { get; set; }
    public string? ReportsToName { get; set; }

    public List<RoleDto> Roles { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class CreateUserDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    // Enterprise/Employee Information
    public string? EmployeeId { get; set; }
    public string? Designation { get; set; }
    public string? Department { get; set; }
    public string? PhoneNumber { get; set; }
    public string? OfficeLocation { get; set; }
    public DateTime? DateOfJoining { get; set; }
    public Guid? ReportsToId { get; set; }

    public List<Guid> RoleIds { get; set; } = new();
}

public class UpdateUserDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public bool IsActive { get; set; }

    // Enterprise/Employee Information
    public string? EmployeeId { get; set; }
    public string? Designation { get; set; }
    public string? Department { get; set; }
    public string? PhoneNumber { get; set; }
    public string? OfficeLocation { get; set; }
    public DateTime? DateOfJoining { get; set; }
    public Guid? ReportsToId { get; set; }
}

public class UpdateAvatarDto
{
    public string? AvatarUrl { get; set; }
    public string? AvatarColor { get; set; }
}

public class AssignRolesDto
{
    public List<Guid> RoleIds { get; set; } = new();
}
