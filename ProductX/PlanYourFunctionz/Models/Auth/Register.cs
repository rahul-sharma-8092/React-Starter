using eClaims.Common;
using eClaims.DTOs.Validation;
using System.ComponentModel.DataAnnotations;

namespace eClaims.Models.Auth
{
    public class Register
    {
        [Required, StringLength(150)]
        [RegularExpression(Regex.NamePattern, ErrorMessage = Message.InvalidData)]
        public string FullName { get; set; } = default!;

        [Range(1, 2, ErrorMessage = "Invalid Role")]
        public Int16 Role { get; set; } = 2;

        [Required, EmailAddress, StringLength(255)]
        public string Email { get; set; } = default!;

        [Required]
        [StringLength(20, MinimumLength = 8, ErrorMessage = Message.InvalidPasswordLength)]
        [RegularExpression(Regex.PasswordPattern, ErrorMessage = Message.PasswordValidationFailed)]
        public string Password { get; set; } = default!;

        [Required]
        [Compare(nameof(Password), ErrorMessage = Message.InvalidConfirmPassword)]
        public string ConfirmPassword { get; set; } = default!;

        [Required, Phone]
        [RegularExpression(Regex.IndianMobilePattern, ErrorMessage = Message.InvalidMobileNumber)]
        public string MobileNumber { get; set; } = default!;

        [Required, StringLength(500)]
        public string Address { get; set; } = default!;

        [Required, StringLength(100)]
        public string City { get; set; } = default!;

        [Required, StringLength(100)]
        public string State { get; set; } = default!;

        [MustBeTrue(ErrorMessage = Message.AcceptTermsCondition)]
        public bool TermsConditions { get; set; }
    }
}
