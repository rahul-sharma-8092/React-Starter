using System.ComponentModel.DataAnnotations;

namespace eClaims.Models.Auth
{
    public class AuthRefreshToken
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public short RoleId { get; set; }
        public string TokenHash { get; set; } = default!;
        public DateTime CreatedATUtc { get; set; }
        public DateTime ExpiresATUtc { get; set; }
        public DateTime? DeletedATUtc { get; set; }
        public string ReplacedByTokenHash { get; set; } = default!;
        public string IpAddress { get; set; } = default!;
    }

    public class RefreshTokenDto
    {
        [Required]
        public string Token { get; set; }
    }
}
