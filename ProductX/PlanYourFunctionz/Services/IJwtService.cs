using eClaims.DTOs.Users;
using eClaims.Models.Auth;

namespace eClaims.Services
{
    public interface IJwtService
    {
        public string GenerateAccessToken(UserLoginDto loginDto);
        public string GenerateRefreshToken();
        public Task<bool> SaveRefreshToken(AuthRefreshToken refreshToken);
        public Task<AuthRefreshToken> GetRefreshTokenByHash(string token);
        public Task<bool> DeleteRefreshTokenByHash(string token);
        public Task<bool> ReplaceRefreshToken(AuthRefreshToken refreshToken);
    }
}
