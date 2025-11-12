using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using eClaims.AppSettings;
using eClaims.Common;
using eClaims.DTOs.Users;
using eClaims.Models.Auth;
using eClaims.Repositories;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace eClaims.Services
{
    public class JwtService : IJwtService
    {
        private readonly JwtSettings _settings;
        private readonly byte[] _key;
        private readonly IEncryptionService _encryptionService;
        private readonly IJwtRepository _jwtRepository;

        public JwtService(IOptions<JwtSettings> jwtOptions, IEncryptionService encryptionService, IJwtRepository jwtRepository)
        {
            _settings = jwtOptions.Value;
            _key = Encoding.UTF8.GetBytes(_settings.Key);
            _encryptionService = encryptionService;
            _jwtRepository = jwtRepository;
        }

        public string GenerateAccessToken(UserLoginDto loginDto)
        {
            string encryptedUserId = _encryptionService.Encrypt(Convert.ToString(loginDto.Id));

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, encryptedUserId),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("fullName", loginDto.FullName),
                new Claim("email", loginDto.Email),
                new Claim("role", AppAuthorization.GetRoleNameById(loginDto.RoleId))
            };

            var creds = new SigningCredentials(new SymmetricSecurityKey(_key), SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _settings.Issuer,
                audience: _settings.Audience,
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddMinutes(_settings.AccessTokenLifetimeMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GenerateRefreshToken()
        {
            var random = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(random);
            
            string hashedToken = HashToken(Convert.ToBase64String(random));
            return hashedToken;
        }

        public async Task<bool> SaveRefreshToken(AuthRefreshToken refreshToken)
        {
            return await _jwtRepository.SaveRefreshToken(refreshToken);
        }

        public async Task<AuthRefreshToken> GetRefreshTokenByHash(string token)
        {
            return await _jwtRepository.GetRefreshTokenByHash(token);
        }

        public async Task<bool> DeleteRefreshTokenByHash(string token)
        {
            return await _jwtRepository.DeleteRefreshTokenByHash(token);
        }

        public async Task<bool> ReplaceRefreshToken(AuthRefreshToken refreshToken)
        {
            return await _jwtRepository.ReplaceRefreshToken(refreshToken);
        }

        private string HashToken(string token)
        {
            using var sha = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(token);
            var hash = sha.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}
