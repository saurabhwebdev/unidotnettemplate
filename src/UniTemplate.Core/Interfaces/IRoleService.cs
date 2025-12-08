using UniTemplate.Core.DTOs;

namespace UniTemplate.Core.Interfaces;

public interface IRoleService
{
    Task<List<RoleDto>> GetAllRolesAsync();
    Task<RoleDto?> GetRoleByIdAsync(Guid id);
    Task<RoleDto> CreateRoleAsync(CreateRoleDto dto);
    Task<RoleDto?> UpdateRoleAsync(Guid id, UpdateRoleDto dto);
    Task<bool> DeleteRoleAsync(Guid id);
}
