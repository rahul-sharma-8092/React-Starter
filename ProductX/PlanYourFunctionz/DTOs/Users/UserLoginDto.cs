namespace eClaims.DTOs.Users
{
    public class UserLoginDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Password { get; set; } = default!;
        public Int16 RoleId { get; set; }
        public string MobileNo { get; set; } = default!;
        public bool IsMobileVerified { get; set; } = default!;
        public bool IsEmailVerified { get; set; } = default!;
        public DateTime? LastLogin { get; set; }
    }
}
