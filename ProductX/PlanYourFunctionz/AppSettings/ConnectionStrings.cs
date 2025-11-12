using System.ComponentModel.DataAnnotations;

namespace eClaims.AppSettings
{
    public class ConnectionStrings
    {
        [Required]
        public string? DefaultConnection { get; set; }
    }
}
