using UniTemplate.Core.DTOs.Auth;

namespace UniTemplate.Core.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto request);
    Task<AuthResponseDto?> LoginAsync(LoginRequestDto request);
    Task<AuthResponseDto?> MicrosoftLoginAsync(MicrosoftLoginRequestDto request);
    Task<AuthResponseDto?> RefreshTokenAsync(string refreshToken);
    Task<bool> ForgotPasswordAsync(ForgotPasswordRequestDto request);
    Task<bool> ResetPasswordAsync(ResetPasswordRequestDto request);
}
