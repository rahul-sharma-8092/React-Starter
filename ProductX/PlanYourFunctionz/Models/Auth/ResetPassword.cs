using eClaims.Common;
using System.ComponentModel.DataAnnotations;

namespace eClaims.Models.Auth
{
    public class ResetPassword
    {
        [Required]
        public string Token { get; set; } = default!;

        [Required]
        [StringLength(20, MinimumLength = 8, ErrorMessage = Message.InvalidPasswordLength)]
        [RegularExpression(Regex.PasswordPattern, ErrorMessage = Message.PasswordValidationFailed)]
        public string NewPassword { get; set; } = default!;

        [Required]
        [Compare(nameof(NewPassword), ErrorMessage = Message.InvalidConfirmPassword)]
        public string ConfirmPassword { get; set; } = default!;
    }
}
