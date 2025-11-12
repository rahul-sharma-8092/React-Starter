using eClaims.DTOs.Auth;
using eClaims.DTOs.Users;
using eClaims.Models.Auth;

namespace eClaims.Repositories
{
    public interface IAuthRepository
    {
        public Task<bool> IsEmailAndMobileUnique(string email, string mobileno, string type);
        public Task<int> RegisterUser(Register registerDto);
        public Task<long> SaveMobileOtp(MobileOtpDto otpDto);
        public Task<EmailVerifiationDto> GenerateEmailVerification(EmailVerifiationDto objDto);
        public Task<bool> VerifyOtpAndActivateAccount(MobileOtpDto objVerify);
        public Task<UserLoginDto> GetUserByEmailOrMobile(string username);
        public Task<UserLoginDto> GetUserByIdAndRole(int userid, short roleid);
        public Task<bool> VerifyEmailGuid(string token);
        public Task<string?> ResetPassword(ResetPassword resetPass, string ipAddress);
    }
}
