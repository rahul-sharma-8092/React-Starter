using System.ComponentModel.DataAnnotations;

namespace eClaims.AppSettings
{
    public class ConfigKey
    {
        [Required]
        public string SiteName { get; set; } = default!;

        [Required]
        public string SiteURL { get; set; } = default!;

        [Required]
        public string SiteApiURL { get; set; } = default!;

        [Required]
        public string SupportEmail { get; set; } = default!;

        [Required]
        public string LogFilePath { get; set; } = default!;
    }
}
