using eClaims.Common;
using eClaims.Models.Validators;
using System.ComponentModel.DataAnnotations;

namespace eClaims.Models.Auth
{
    public class Login
    {
        [Required]
        [UserNameValidation]
        public string UserName { get; set; } = default!;

        [Required]
        [RegularExpression(Regex.PasswordPattern, ErrorMessage = Message.PasswordValidationFailed)]
        public string Password { get; set; } = default!;
    }
}
