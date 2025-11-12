using Dapper;
using Microsoft.Extensions.Options;
using eClaims.AppSettings;
using eClaims.Models.Auth;

namespace eClaims.Repositories
{
    public class JwtRepository : BaseSQL, IJwtRepository
    {
        public JwtRepository(IOptions<ConnectionStrings> options) : base(options)
        {
        }

        public async Task<bool> SaveRefreshToken(AuthRefreshToken refreshToken)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserId", refreshToken.UserId);
            parameters.Add("@RoleId", refreshToken.RoleId);
            parameters.Add("@TokenHash", refreshToken.TokenHash);
            parameters.Add("@IpAddress", refreshToken.IpAddress);

            await ExecuteScalarAsync<bool>("SaveRefreshToken", parameters);
            return true;
        }

        public async Task<AuthRefreshToken> GetRefreshTokenByHash(string tokenHash)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@TokenHash", tokenHash);

            return await ExecuteFirstorDefaultAsync<AuthRefreshToken>("GetRefreshTokenByHash", parameters);
        }

        public async Task<bool> DeleteRefreshTokenByHash(string tokenHash)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@TokenHash", tokenHash);

            return await ExecuteScalarAsync<bool>("DeleteRefreshTokenByHash", parameters);
        }

        public async Task<bool> ReplaceRefreshToken(AuthRefreshToken refreshToken)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Id", refreshToken.Id);
            parameters.Add("@TokenHash", refreshToken.TokenHash);
            parameters.Add("@IpAddress", refreshToken.IpAddress);
            parameters.Add("@ExpiresATUtc", refreshToken.ExpiresATUtc);
            parameters.Add("@ReplacedByTokenHash", refreshToken.ReplacedByTokenHash);

            return await ExecuteScalarAsync<bool>("ReplaceRefreshToken", parameters);
        }
    }
}
