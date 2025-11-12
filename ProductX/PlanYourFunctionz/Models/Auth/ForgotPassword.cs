using eClaims.Models.Validators;
using System.ComponentModel.DataAnnotations;

namespace eClaims.Models.Auth
{
    public class ForgotPassword
    {
        [Required]
        [UserNameValidation]
        public string UserName { get; set; } = default!;
    }
}
