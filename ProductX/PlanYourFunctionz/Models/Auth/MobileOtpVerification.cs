using eClaims.Common;
using System.ComponentModel.DataAnnotations;

namespace eClaims.Models.Auth
{
    public class MobileOtpVerification
    {
        [Required]
        public string PreAuthToken { get; set; } = string.Empty;

        [Required, StringLength(6, ErrorMessage = Message.InvalidOtp)]
        public string Otp { get; set; } = string.Empty;
        public string Initiator { get; set; } = string.Empty;
    }
}
