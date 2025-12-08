using System.Security.Claims;
using UniTemplate.Core.Entities;

namespace UniTemplate.Core.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
}
