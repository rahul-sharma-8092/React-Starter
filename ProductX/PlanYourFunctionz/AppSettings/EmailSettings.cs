using System.ComponentModel.DataAnnotations;

namespace eClaims.AppSettings
{
    public class EmailSettings
    {
        [Required]
        public string? SmtpServer { get; set; }

        [Range(1, int.MaxValue)]
        public int Port { get; set; }

        [Required]
        public string? SenderName { get; set; }

        [Required, EmailAddress]
        public string? SenderEmail { get; set; }

        public string? Username { get; set; }
        public string? Password { get; set; }

        public bool EnableSSL { get; set; }
    }
}
