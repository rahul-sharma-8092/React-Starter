using eClaims.DTOs.Auth;
using eClaims.DTOs.Users;
using eClaims.Models.Auth;

namespace eClaims.Services
{
    public interface IAuthService
    {
        public Task<bool> IsEmailAndMobileUnique(string email, string mobileno);
        public Task<bool> IsEmailUnique(string email);
        public Task<bool> IsMobileNoUnique(string mobileno);
        public Task<int> RegisterUser(Register registerDto);
        public Task<string> GeneratePreAuthToken(MobileOtpDto otpDto);
        public Task<bool> SendEmailVerification(int userId, short roleId, string ipAddress);
        public Task<bool> SendForgotPasswordLink(UserLoginDto user, string ipAddress);
        public Task<string?> ResetPassword(ResetPassword resetPass, string ipAddress);
        public Task<bool> SendPasswordChangedEmail(UserLoginDto user, string ipAddress);
        public Task<bool> VerifyMobileOtp(MobileOtpVerification mobileOtpVerification);
        public Task<UserLoginDto> GetUserByEmailOrMobile(string username);
        public Task<UserLoginDto> GetUserByIdAndRole(int userid, short roleid);
        public Task<bool> VerifyEmailGuid(string token);
    }
}
