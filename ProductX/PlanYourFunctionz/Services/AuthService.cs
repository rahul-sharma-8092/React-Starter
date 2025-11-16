
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using eClaims.AppSettings;
using eClaims.Common;
using eClaims.DTOs.Auth;
using eClaims.DTOs.Users;
using eClaims.Models;
using eClaims.Models.Auth;
using eClaims.Repositories;
using System;

namespace eClaims.Services
{
    public class AuthService : IAuthService
    {
        private readonly ConfigKey _configKey;
        private readonly IAuthRepository _authRepository;
        private readonly IEncryptionService _encryptionService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IEmailService _emailService;

        public AuthService(IOptions<ConfigKey> configKeyOptions, IAuthRepository authRepository, IEncryptionService encryptionService, IWebHostEnvironment webHostEnvironment, IEmailService emailService)
        {
            _configKey = configKeyOptions.Value;
            _authRepository = authRepository;
            _encryptionService = encryptionService;
            _webHostEnvironment = webHostEnvironment;
            _emailService = emailService;
        }

        public async Task<bool> IsEmailAndMobileUnique(string email, string mobileno)
        {
            return await _authRepository.IsEmailAndMobileUnique(email, mobileno, "both");
        }

        public async Task<bool> IsEmailUnique(string email)
        {
            return await _authRepository.IsEmailAndMobileUnique(email, string.Empty, "email");
        }

        public async Task<bool> IsMobileNoUnique(string mobileno)
        {
            return await _authRepository.IsEmailAndMobileUnique(string.Empty, mobileno, "mobile");
        }

        public async Task<int> RegisterUser(Register registerDto)
        {
            registerDto.Password = _encryptionService.HashPassword(registerDto.Password);
            return await _authRepository.RegisterUser(registerDto);
        }

        public async Task<string> GeneratePreAuthToken(MobileOtpDto otpDto)
        {
            otpDto.OtpType = "Register";
            otpDto.OtpCode = Utility.GenerateSixDigitOtp();
            long result = await _authRepository.SaveMobileOtp(otpDto);

            string preAuthToken = "";
            if (result < 0)
            {
                return preAuthToken;
            }

            //TODO: Send OTP to user's mobile number via SMS gateway

            preAuthToken = otpDto.UserId.ToString() + "|" + otpDto.RoleId.ToString() + "|" + otpDto.OtpType;
            preAuthToken = _encryptionService.Encrypt(preAuthToken);
            
            return preAuthToken;
        }

        public async Task<bool> SendEmailVerification(int userId, short roleId, string ipAddress)
        {
            string guid = Guid.NewGuid().ToString();
            EmailVerifiationDto objDto = new EmailVerifiationDto();
            objDto.UserId = userId;
            objDto.RoleId = roleId;
            objDto.Guid = guid;
            objDto.IpAddress = ipAddress;
            objDto.EmailType = "VerifyEmail";
            objDto.ExpiresAT = DateTime.UtcNow.AddDays(7);

            objDto = await _authRepository.GenerateEmailVerification(objDto);

            if (objDto == null || objDto.UserId < 1 || objDto.RoleId < 1)
            {
                return false;
            }

            EmailMsg msg = new EmailMsg();
            msg.To = objDto.Email;
            msg.Subject = $"Welcome to {_configKey.SiteName}: Please verify email to activate your account!";

            string confirmationUrl = $"{_configKey.SiteURL}/verify-email/{objDto.Guid}";

            string templatePath = Path.Combine(_webHostEnvironment.WebRootPath, "EmailTemplate", "EmailVerification.html");
            string emailBody = System.IO.File.ReadAllText(templatePath);

            emailBody = emailBody.Replace("{{SiteName}}", _configKey.SiteName)
                                 .Replace("{{SiteURL}}", _configKey.SiteURL)
                                 .Replace("{{FullName}}", objDto.FullName)
                                 .Replace("{{ConfirmationURL}}", confirmationUrl)
                                 .Replace("{{SupportEmail}}", _configKey.SupportEmail)
                                 .Replace("{{ExpTime}}", "7");

            ErrorLogToFolder.LogInfo($"Email Verification link for User: {objDto.FullName}", "AuthService");
            ErrorLogToFolder.LogInfo(emailBody, "AuthService");

            msg.Body = emailBody;
            msg.IsHtml = true;
            msg.IsSent = await _emailService.SendEmailAsync(msg);
            return msg.IsSent;
        }

        public async Task<bool> SendForgotPasswordLink(UserLoginDto userDto, string ipAddress)
        {
            string guid = Guid.NewGuid().ToString();
            EmailVerifiationDto objDto = new EmailVerifiationDto();
            objDto.UserId = userDto.Id;
            objDto.RoleId = userDto.RoleId;
            objDto.Guid = guid;
            objDto.IpAddress = ipAddress;
            objDto.EmailType = "ResetPassword";
            objDto.ExpiresAT = DateTime.UtcNow.AddHours(4);

            objDto = await _authRepository.GenerateEmailVerification(objDto);

            if (objDto == null || objDto.UserId < 1 || objDto.RoleId < 1)
            {
                return false;
            }

            EmailMsg msg = new EmailMsg();
            msg.To = objDto.Email;
            msg.Subject = $"Reset Your {_configKey.SiteName} Password";

            string resetPasswordUrl = $"{_configKey.SiteURL}/auth/reset-password/{objDto.Guid}";

            string templatePath = Path.Combine(_webHostEnvironment.WebRootPath, "EmailTemplate", "ForgotPassword.html");
            string emailBody = System.IO.File.ReadAllText(templatePath);

            emailBody = emailBody.Replace("{{SiteName}}", _configKey.SiteName)
                                 .Replace("{{SiteURL}}", _configKey.SiteURL)
                                 .Replace("{{FullName}}", objDto.FullName)
                                 .Replace("{{ResetPasswordURL}}", resetPasswordUrl)
                                 .Replace("{{SupportEmail}}", _configKey.SupportEmail)
                                 .Replace("{{ExpTime}}", "4");

            msg.Body = emailBody;
            msg.IsHtml = true;
            msg.IsSent = await _emailService.SendEmailAsync(msg);
            return msg.IsSent;
        }

        public async Task<string?> ResetPassword(ResetPassword resetPassword, string ipAddress)
        {
            resetPassword.NewPassword = _encryptionService.HashPassword(resetPassword.NewPassword);
            return await _authRepository.ResetPassword(resetPassword, ipAddress);
        }

        public async Task<bool> SendPasswordChangedEmail(UserLoginDto userDto, string ipAddress)
        {
            if (userDto == null || userDto.Id < 1 || userDto.RoleId < 1)
            {
                return false;
            }

            EmailMsg msg = new EmailMsg();
            msg.To = userDto.Email;
            msg.Subject = $"Your {_configKey.SiteName} password has been changed successfully";

            string resetPasswordUrl = $"{_configKey.SiteURL}/auth/forgot-password";

            string templatePath = Path.Combine(_webHostEnvironment.WebRootPath, "EmailTemplate", "PasswordChanged.html");
            string emailBody = System.IO.File.ReadAllText(templatePath);

            emailBody = emailBody.Replace("{{SiteName}}", _configKey.SiteName)
                     .Replace("{{SiteURL}}", _configKey.SiteURL)
                     .Replace("{{FullName}}", userDto.FullName)
                     .Replace("{{ResetPasswordURL}}", resetPasswordUrl)
                     .Replace("{{SupportEmail}}", _configKey.SupportEmail)
                     .Replace("{{ChangedDate}}", DateTime.Now.ToString("dd MMMM yyyy hh:mm:ss tt"))
                     .Replace("{{IpAddress}}", ipAddress ?? "Unknown");

            msg.Body = emailBody;
            msg.IsHtml = true;
            msg.IsSent = await _emailService.SendEmailAsync(msg);
            return msg.IsSent;
        }

        public async Task<bool> VerifyMobileOtp(MobileOtpVerification mobileOtpVerification)
        {
            bool isVerified = false;
            try
            {
                string preAuth = _encryptionService.Decrypt(mobileOtpVerification.PreAuthToken);
                string[] tokenParts = preAuth.Split('|');

                if (tokenParts.Length != 3)
                {
                    return false;
                }

                MobileOtpDto objOtp = new MobileOtpDto();
                objOtp.UserId = Convert.ToInt32(tokenParts[0]);
                objOtp.RoleId = Convert.ToInt16(tokenParts[1]);
                objOtp.OtpType = Convert.ToString(tokenParts[2]);
                objOtp.OtpCode = mobileOtpVerification.Otp.Trim();

                isVerified = await _authRepository.VerifyOtpAndActivateAccount(objOtp);
            }
            catch(Exception)
            {
                isVerified = false;
            }
            return isVerified;
        }

        public async Task<UserLoginDto> GetUserByEmailOrMobile(string username)
        {
            return await _authRepository.GetUserByEmailOrMobile(username);
        }

        public async Task<UserLoginDto> GetUserByIdAndRole(int userid, short roleid)
        {
            return await _authRepository.GetUserByIdAndRole(userid, roleid);
        }

        public async Task<bool> VerifyEmailGuid(string token)
        {
            bool isValidGuid = Guid.TryParse(token, out Guid parsedGuid);
            if (!isValidGuid)
            {
                return false;
            }

            return await _authRepository.VerifyEmailGuid(token);
        }
    }
}
