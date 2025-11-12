using System.ComponentModel.DataAnnotations;

namespace eClaims.AppSettings
{
    public class JwtSettings
    {
        [Required]
        public string? Key { get; set; }
        
        [Required]
        public string? Issuer { get; set; }

        [Required]
        public string? Audience { get; set; }

        [Range(1, int.MaxValue)]
        public int AccessTokenLifetimeMinutes { get; set; }

        [Range(1, int.MaxValue)]
        public int RefreshTokenLifetimeDays { get; set; }
    }
}
