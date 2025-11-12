namespace eClaims.DTOs.Auth
{
    public class MobileOtpDto
    {
        public int UserId { get; set; }
        public short RoleId { get; set; }
        public string MobileNo { get; set; } = default!;
        public string OtpCode { get; set; } = default!;
        public string OtpType { get; set; } = default!;
        public string IpAddress { get; set; } = default!;
    }
}
