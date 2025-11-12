
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;
using eClaims.AppSettings;
using eClaims.DTOs.Auth;
using eClaims.DTOs.Users;
using eClaims.Models.Auth;
using System.Data;

namespace eClaims.Repositories
{
    public class AuthRepository : BaseSQL, IAuthRepository
    {
        public AuthRepository(IOptions<ConnectionStrings> options) : base(options)
        {
        }

        public async Task<bool> IsEmailAndMobileUnique(string email, string mobileno, string type)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Email", email);
            parameters.Add("@Mobile", mobileno);
            parameters.Add("@Type", type);

            return await ExecuteScalarAsync<bool>("IsEmailAndMobileUnique", parameters);
        }

        public async Task<int> RegisterUser(Register registerDto)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@FullName", registerDto.FullName);
            parameters.Add("@Role", registerDto.Role);
            parameters.Add("@Email", registerDto.Email);
            parameters.Add("@Password", registerDto.Password);
            parameters.Add("@MobileNo", registerDto.MobileNumber);
            parameters.Add("@Address", registerDto.Address);
            parameters.Add("@City", registerDto.City);
            parameters.Add("@State", registerDto.State);

            return await ExecuteScalarAsync<int>("RegisterUser", parameters);
        }

        public async Task<long> SaveMobileOtp(MobileOtpDto otpDto)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserId", otpDto.UserId);
            parameters.Add("@RoleId", otpDto.RoleId);
            parameters.Add("@MobileNo", otpDto.MobileNo);
            parameters.Add("@OtpCode", otpDto.OtpCode);
            parameters.Add("@OtpType", otpDto.OtpType);
            parameters.Add("@IpAddress", otpDto.IpAddress);

            return await ExecuteScalarAsync<long>("SaveMobileOtp", parameters);
        }

        public async Task<EmailVerifiationDto> GenerateEmailVerification(EmailVerifiationDto objDto)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserId", objDto.UserId);
            parameters.Add("@RoleId", objDto.RoleId);
            parameters.Add("@Guid", objDto.Guid);
            parameters.Add("@IpAddress", objDto.IpAddress);
            parameters.Add("@ExpiresAT", objDto.ExpiresAT);
            parameters.Add("@EmailType", objDto.EmailType);

            return await ExecuteFirstorDefaultAsync<EmailVerifiationDto>("GenerateEmailVerification", parameters);
        }

        public async Task<bool> VerifyOtpAndActivateAccount(MobileOtpDto objVerify)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserId", objVerify.UserId);
            parameters.Add("@RoleId", objVerify.RoleId);
            parameters.Add("@OtpCode", objVerify.OtpCode);
            parameters.Add("@OtpType", objVerify.OtpType);

            return await ExecuteScalarAsync<bool>("VerifyOtpAndActivateAccount", parameters);
        }

        public async Task<UserLoginDto> GetUserByEmailOrMobile(string username)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserName", username);

            return await ExecuteFirstorDefaultAsync<UserLoginDto>("GetUserByEmailOrMobile", parameters);
        }

        public async Task<UserLoginDto> GetUserByIdAndRole(int userid, short roleid)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserId", userid);
            parameters.Add("@RoleId", roleid);

            return await ExecuteFirstorDefaultAsync<UserLoginDto>("GetUserByIdAndRole", parameters);
        }

        public async Task<bool> VerifyEmailGuid(string token)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Token", token);

            return await ExecuteScalarAsync<bool>("VerifyEmailGuid", parameters);
        }

        public async Task<string?> ResetPassword(ResetPassword resetPass, string ipAddress)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Token", resetPass.Token);
            parameters.Add("@NewPassword", resetPass.NewPassword);
            parameters.Add("@IpAddress", ipAddress);

            return await ExecuteScalarAsync<string>("ResetPassword", parameters);
        }
    }
}
