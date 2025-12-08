using UniTemplate.Core.DTOs;

namespace UniTemplate.Core.Interfaces;

public interface IUserService
{
    Task<List<UserDto>> GetAllUsersAsync();
    Task<UserDto?> GetUserByIdAsync(Guid id);
    Task<UserDto> CreateUserAsync(CreateUserDto dto);
    Task<UserDto?> UpdateUserAsync(Guid id, UpdateUserDto dto);
    Task<bool> DeleteUserAsync(Guid id);
    Task<UserDto?> AssignRolesToUserAsync(Guid userId, AssignRolesDto dto);
    Task<UserDto?> UpdateAvatarAsync(Guid userId, UpdateAvatarDto dto);
}
