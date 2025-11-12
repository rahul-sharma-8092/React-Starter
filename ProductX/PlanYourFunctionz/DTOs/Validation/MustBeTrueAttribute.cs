using System.ComponentModel.DataAnnotations;

namespace eClaims.DTOs.Validation
{
    /// <summary>
    /// Validates that a boolean property must be true.
    /// </summary>
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    public class MustBeTrueAttribute : ValidationAttribute
    {
        private const string DefaultErrorTemplate = "The field {0} must be true.";

        public MustBeTrueAttribute() : base(DefaultErrorTemplate)
        {
        }

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            // If the value is true, validation passes
            if (value is bool boolValue && boolValue)
                return ValidationResult.Success;

            // Determine error message
            var errorMsg = string.IsNullOrWhiteSpace(ErrorMessage)
                ? string.Format(DefaultErrorTemplate, validationContext.DisplayName)
                : ErrorMessage;

            return new ValidationResult(errorMsg);
        }
    }
}
