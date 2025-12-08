using Microsoft.EntityFrameworkCore;
using UniTemplate.Core.DTOs;
using UniTemplate.Core.Entities;
using UniTemplate.Core.Interfaces;

namespace UniTemplate.Data.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserDto>> GetAllUsersAsync()
    {
        return await _context.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .Include(u => u.ReportsTo)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                AvatarUrl = u.AvatarUrl,
                AvatarColor = u.AvatarColor,
                IsActive = u.IsActive,
                EmployeeId = u.EmployeeId,
                Designation = u.Designation,
                Department = u.Department,
                PhoneNumber = u.PhoneNumber,
                OfficeLocation = u.OfficeLocation,
                DateOfJoining = u.DateOfJoining,
                ReportsToId = u.ReportsToId,
                ReportsToName = u.ReportsTo != null ? u.ReportsTo.FirstName + " " + u.ReportsTo.LastName : null,
                CreatedAt = u.CreatedAt,
                Roles = u.UserRoles.Select(ur => new RoleDto
                {
                    Id = ur.Role.Id,
                    Name = ur.Role.Name,
                    Description = ur.Role.Description,
                    IsSystemRole = ur.Role.IsSystemRole,
                    CreatedAt = ur.Role.CreatedAt
                }).ToList()
            })
            .ToListAsync();
    }

    public async Task<UserDto?> GetUserByIdAsync(Guid id)
    {
        var user = await _context.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .Include(u => u.ReportsTo)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null) return null;

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            AvatarUrl = user.AvatarUrl,
            AvatarColor = user.AvatarColor,
            IsActive = user.IsActive,
            EmployeeId = user.EmployeeId,
            Designation = user.Designation,
            Department = user.Department,
            PhoneNumber = user.PhoneNumber,
            OfficeLocation = user.OfficeLocation,
            DateOfJoining = user.DateOfJoining,
            ReportsToId = user.ReportsToId,
            ReportsToName = user.ReportsTo != null ? user.ReportsTo.FirstName + " " + user.ReportsTo.LastName : null,
            CreatedAt = user.CreatedAt,
            Roles = user.UserRoles.Select(ur => new RoleDto
            {
                Id = ur.Role.Id,
                Name = ur.Role.Name,
                Description = ur.Role.Description,
                IsSystemRole = ur.Role.IsSystemRole,
                CreatedAt = ur.Role.CreatedAt
            }).ToList()
        };
    }

    public async Task<UserDto> CreateUserAsync(CreateUserDto dto)
    {
        var user = new User
        {
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            IsActive = true,
            EmployeeId = dto.EmployeeId,
            Designation = dto.Designation,
            Department = dto.Department,
            PhoneNumber = dto.PhoneNumber,
            OfficeLocation = dto.OfficeLocation,
            DateOfJoining = dto.DateOfJoining,
            ReportsToId = dto.ReportsToId
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Assign roles
        if (dto.RoleIds.Any())
        {
            foreach (var roleId in dto.RoleIds)
            {
                _context.UserRoles.Add(new UserRole
                {
                    UserId = user.Id,
                    RoleId = roleId
                });
            }
            await _context.SaveChangesAsync();
        }

        return (await GetUserByIdAsync(user.Id))!;
    }

    public async Task<UserDto?> UpdateUserAsync(Guid id, UpdateUserDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return null;

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.IsActive = dto.IsActive;
        user.EmployeeId = dto.EmployeeId;
        user.Designation = dto.Designation;
        user.Department = dto.Department;
        user.PhoneNumber = dto.PhoneNumber;
        user.OfficeLocation = dto.OfficeLocation;
        user.DateOfJoining = dto.DateOfJoining;
        user.ReportsToId = dto.ReportsToId;

        await _context.SaveChangesAsync();

        return await GetUserByIdAsync(id);
    }

    public async Task<bool> DeleteUserAsync(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<UserDto?> AssignRolesToUserAsync(Guid userId, AssignRolesDto dto)
    {
        var user = await _context.Users
            .Include(u => u.UserRoles)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return null;

        // Remove existing roles
        _context.UserRoles.RemoveRange(user.UserRoles);

        // Add new roles
        foreach (var roleId in dto.RoleIds)
        {
            _context.UserRoles.Add(new UserRole
            {
                UserId = userId,
                RoleId = roleId
            });
        }

        await _context.SaveChangesAsync();

        return await GetUserByIdAsync(userId);
    }

    public async Task<UserDto?> UpdateAvatarAsync(Guid userId, UpdateAvatarDto dto)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return null;

        user.AvatarUrl = dto.AvatarUrl;
        user.AvatarColor = dto.AvatarColor;

        await _context.SaveChangesAsync();

        return await GetUserByIdAsync(userId);
    }
}
