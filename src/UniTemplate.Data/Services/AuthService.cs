using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using UniTemplate.Core.Configuration;
using UniTemplate.Core.DTOs.Auth;
using UniTemplate.Core.Entities;
using UniTemplate.Core.Interfaces;

namespace UniTemplate.Data.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly ITokenService _tokenService;
    private readonly IEmailService _emailService;
    private readonly JwtSettings _jwtSettings;

    public AuthService(AppDbContext context, ITokenService tokenService, IEmailService emailService, IOptions<JwtSettings> jwtSettings)
    {
        _context = context;
        _tokenService = tokenService;
        _emailService = emailService;
        _jwtSettings = jwtSettings.Value;
    }

    public async Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto request)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return null;
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            PasswordHash = passwordHash,
            FirstName = request.FirstName,
            LastName = request.LastName,
            IsActive = true
        };

        var refreshToken = _tokenService.GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpiryInDays);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Assign default "User" role
        var defaultRoleId = Guid.Parse("22222222-2222-2222-2222-222222222222");
        _context.UserRoles.Add(new UserRole
        {
            UserId = user.Id,
            RoleId = defaultRoleId
        });
        await _context.SaveChangesAsync();

        var accessToken = _tokenService.GenerateAccessToken(user);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryInMinutes),
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName
            }
        };
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return null;
        }

        if (!user.IsActive)
        {
            return null;
        }

        var refreshToken = _tokenService.GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpiryInDays);

        await _context.SaveChangesAsync();

        var accessToken = _tokenService.GenerateAccessToken(user);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryInMinutes),
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName
            }
        };
    }

    public async Task<AuthResponseDto?> MicrosoftLoginAsync(MicrosoftLoginRequestDto request)
    {
        if (string.IsNullOrEmpty(request.Email))
        {
            return null;
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        var isNewUser = user == null;

        if (user == null)
        {
            var names = request.Name?.Split(' ') ?? new[] { request.Email };
            var firstName = names.Length > 0 ? names[0] : request.Email;
            var lastName = names.Length > 1 ? string.Join(" ", names.Skip(1)) : "";

            user = new User
            {
                Id = Guid.NewGuid(),
                Email = request.Email,
                PasswordHash = string.Empty,
                FirstName = firstName,
                LastName = lastName,
                IsActive = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Assign default "User" role for new users
            var defaultRoleId = Guid.Parse("22222222-2222-2222-2222-222222222222");
            _context.UserRoles.Add(new UserRole
            {
                UserId = user.Id,
                RoleId = defaultRoleId
            });
        }

        if (!user.IsActive)
        {
            return null;
        }

        var refreshToken = _tokenService.GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpiryInDays);

        await _context.SaveChangesAsync();

        var accessToken = _tokenService.GenerateAccessToken(user);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryInMinutes),
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName
            }
        };
    }

    public async Task<AuthResponseDto?> RefreshTokenAsync(string refreshToken)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

        if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            return null;
        }

        var newRefreshToken = _tokenService.GenerateRefreshToken();
        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpiryInDays);

        await _context.SaveChangesAsync();

        var accessToken = _tokenService.GenerateAccessToken(user);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = newRefreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryInMinutes),
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName
            }
        };
    }

    public async Task<bool> ForgotPasswordAsync(ForgotPasswordRequestDto request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
        {
            // Return true even if user doesn't exist to prevent email enumeration
            return true;
        }

        // Generate secure random token
        var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));

        // Invalidate any existing tokens for this user
        var existingTokens = await _context.PasswordResetTokens
            .Where(t => t.UserId == user.Id && !t.IsUsed && t.ExpiryTime > DateTime.UtcNow)
            .ToListAsync();

        foreach (var existingToken in existingTokens)
        {
            existingToken.IsUsed = true;
        }

        // Create new reset token
        var resetToken = new PasswordResetToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = token,
            ExpiryTime = DateTime.UtcNow.AddHours(24),
            IsUsed = false
        };

        _context.PasswordResetTokens.Add(resetToken);
        await _context.SaveChangesAsync();

        // Send password reset email
        var resetLink = $"http://localhost:5173/reset-password?token={Uri.EscapeDataString(token)}";
        await _emailService.SendPasswordResetEmailAsync(user.Email, resetLink);

        return true;
    }

    public async Task<bool> ResetPasswordAsync(ResetPasswordRequestDto request)
    {
        var resetToken = await _context.PasswordResetTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Token == request.Token && !t.IsUsed && t.ExpiryTime > DateTime.UtcNow);

        if (resetToken == null)
        {
            return false;
        }

        // Update user password
        resetToken.User.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

        // Mark token as used
        resetToken.IsUsed = true;

        await _context.SaveChangesAsync();

        return true;
    }
}
