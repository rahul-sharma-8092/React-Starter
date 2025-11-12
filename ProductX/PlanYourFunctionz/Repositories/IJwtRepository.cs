
using eClaims.Models.Auth;

namespace eClaims.Repositories
{
    public interface IJwtRepository
    {
        public Task<bool> SaveRefreshToken(AuthRefreshToken refreshToken);
        public Task<AuthRefreshToken> GetRefreshTokenByHash(string tokenHash);
        public Task<bool> DeleteRefreshTokenByHash(string tokenHash);
        public Task<bool> ReplaceRefreshToken(AuthRefreshToken refreshToken);
    }
}
