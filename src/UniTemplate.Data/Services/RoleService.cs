using Microsoft.EntityFrameworkCore;
using UniTemplate.Core.DTOs;
using UniTemplate.Core.Entities;
using UniTemplate.Core.Interfaces;

namespace UniTemplate.Data.Services;

public class RoleService : IRoleService
{
    private readonly AppDbContext _context;

    public RoleService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<RoleDto>> GetAllRolesAsync()
    {
        return await _context.Roles
            .Select(r => new RoleDto
            {
                Id = r.Id,
                Name = r.Name,
                Description = r.Description,
                IsSystemRole = r.IsSystemRole,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<RoleDto?> GetRoleByIdAsync(Guid id)
    {
        var role = await _context.Roles.FindAsync(id);
        if (role == null) return null;

        return new RoleDto
        {
            Id = role.Id,
            Name = role.Name,
            Description = role.Description,
            IsSystemRole = role.IsSystemRole,
            CreatedAt = role.CreatedAt
        };
    }

    public async Task<RoleDto> CreateRoleAsync(CreateRoleDto dto)
    {
        var role = new Role
        {
            Name = dto.Name,
            Description = dto.Description,
            IsSystemRole = false
        };

        _context.Roles.Add(role);
        await _context.SaveChangesAsync();

        return new RoleDto
        {
            Id = role.Id,
            Name = role.Name,
            Description = role.Description,
            IsSystemRole = role.IsSystemRole,
            CreatedAt = role.CreatedAt
        };
    }

    public async Task<RoleDto?> UpdateRoleAsync(Guid id, UpdateRoleDto dto)
    {
        var role = await _context.Roles.FindAsync(id);
        if (role == null || role.IsSystemRole) return null;

        role.Name = dto.Name;
        role.Description = dto.Description;

        await _context.SaveChangesAsync();

        return new RoleDto
        {
            Id = role.Id,
            Name = role.Name,
            Description = role.Description,
            IsSystemRole = role.IsSystemRole,
            CreatedAt = role.CreatedAt
        };
    }

    public async Task<bool> DeleteRoleAsync(Guid id)
    {
        var role = await _context.Roles.FindAsync(id);
        if (role == null || role.IsSystemRole) return false;

        _context.Roles.Remove(role);
        await _context.SaveChangesAsync();
        return true;
    }
}
