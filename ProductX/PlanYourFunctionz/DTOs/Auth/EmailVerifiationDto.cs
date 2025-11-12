namespace eClaims.DTOs.Auth
{
    public class EmailVerifiationDto
    {
        public int UserId { get; set; }
        public short RoleId { get; set; }
        public string FullName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Guid { get; set; } = default!;
        public string IpAddress { get; set; } = default!;
        public string EmailType { get; set; } = default!;
        public DateTime ExpiresAT { get; set; }
    }
}
