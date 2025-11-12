namespace eClaims.DTOs.Users
{
    public class PreAuthTokenDto
    {
        public string UserId { get; set; } = default!;
        public string RoleId { get; set; } = default!;
        public string OtpType { get; set; } = default!;
    }
}
