using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace eClaims.Models.Validators
{
    public class UserNameValidationAttribute : ValidationAttribute
    {
        private static readonly Regex EmailRegex = new Regex(Common.Regex.EmailPattern, RegexOptions.Compiled | RegexOptions.IgnoreCase);

        private static readonly Regex MobileRegex = new Regex(Common.Regex.IndianMobilePattern, RegexOptions.Compiled);

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is null)
                return ValidationResult.Success;

            string input = value.ToString()!.Trim();

            if (EmailRegex.IsMatch(input) || MobileRegex.IsMatch(input))
                return ValidationResult.Success;

            return new ValidationResult(ErrorMessage ?? "Invalid mobile number or email address");
        }
    }
}
