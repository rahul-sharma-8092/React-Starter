using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using eClaims.AppSettings;
using eClaims.Common;
using eClaims.DTOs.Auth;
using eClaims.DTOs.Users;
using eClaims.Infrastructure;
using eClaims.Models.Auth;
using eClaims.Services;

namespace eClaims.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IEncryptionService _encryptionService;
        private readonly IJwtService _jwtService;
        private readonly JwtSettings _jwtSettings;

        public AuthController(IAuthService authService, IEncryptionService encryptionService, IJwtService jwtService, IOptions<JwtSettings> jwtOptions)
        {
            _authService = authService;
            _encryptionService = encryptionService;
            _jwtService = jwtService;
            _jwtSettings = jwtOptions.Value;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(Login objLogin)
        {
            if (!ModelState.IsValid)
                this.BadRequestResponse(Message.InvalidRequest, ModelState);

            UserLoginDto user = await _authService.GetUserByEmailOrMobile(objLogin.UserName);
            if (user == null || user.Id < 1)
            {
                return this.NotFoundResponse(Message.UserNotFound);
            }

            bool isPasswordValid = _encryptionService.VerifyPassword(objLogin.Password, user.Password);
            if (!isPasswordValid)
            {
                return this.UnauthorizedResponse(Message.InvalidCredentials);
            }

            //Mobile verification pending
            if (!user.IsMobileVerified)
            {
                MobileOtpDto objOtpDto = new MobileOtpDto();
                objOtpDto.UserId = user.Id;
                objOtpDto.RoleId = user.RoleId;
                objOtpDto.MobileNo = user.MobileNo;
                objOtpDto.IpAddress = HttpContext.GetClientIpAddress();

                string preAuthToken = await _authService.GeneratePreAuthToken(objOtpDto);
                string maskedMobileNo = Utility.MaskMobileNumber(user.MobileNo);

                return this.OkResponse(new { IsMobilePending = true, PreAuthToken = preAuthToken, MobileNo = maskedMobileNo, Initiator = "login" }, Message.OtpSent);
            }

            //User verified, proceed with login
            string jwtAccessToken = _jwtService.GenerateAccessToken(user);

            // Save and set refresh token
            AuthRefreshToken refreshToken = new AuthRefreshToken();
            refreshToken.UserId = user.Id;
            refreshToken.RoleId = user.RoleId;
            refreshToken.TokenHash = _jwtService.GenerateRefreshToken();
            refreshToken.IpAddress = HttpContext.GetClientIpAddress();
            refreshToken.ExpiresATUtc = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenLifetimeDays);
            
            await _jwtService.SaveRefreshToken(refreshToken);

            //SetAccessCookie(jwtAccessToken, DateTime.UtcNow.AddDays(_jwtSettings.AccessTokenLifetimeMinutes));
            SetRefreshCookie(refreshToken.TokenHash, refreshToken.ExpiresATUtc);

            var responseData = new
            {
                accessToken = jwtAccessToken,
                refreshToken = refreshToken.TokenHash,
                //expiresIn = _jwtSettings.AccessTokenLifetimeMinutes * 60,
            };

            return this.OkResponse(responseData, Message.LoginSuccess, true);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(Register registerDto)
        {
            if (!ModelState.IsValid)
                this.BadRequestResponse(Message.InvalidRequest, ModelState);

            bool isUserUnique = await _authService.IsEmailAndMobileUnique(registerDto.Email, registerDto.MobileNumber);
            if (!isUserUnique)
            {
                return this.ConflictResponse(Message.UserAlreadyExists);
            }

            int userId = await _authService.RegisterUser(registerDto);
            if (userId < 1)
            {
                return this.InternalServerError(Message.SomethingWrong);
            }

            MobileOtpDto objOtpDto = new MobileOtpDto();
            objOtpDto.UserId = userId;
            objOtpDto.RoleId = AppAuthorization.RoleIDs.User;
            objOtpDto.MobileNo = registerDto.MobileNumber;
            objOtpDto.IpAddress = HttpContext.GetClientIpAddress();
            
            await _authService.SendEmailVerification(userId, AppAuthorization.RoleIDs.User, objOtpDto.IpAddress);
            
            string maskedMobileNo = Utility.MaskMobileNumber(registerDto.MobileNumber);
            string preAuthToken = await _authService.GeneratePreAuthToken(objOtpDto);

            return this.OkResponse(new { PreAuthToken = preAuthToken, MobileNo = maskedMobileNo, Initiator = "register" }, Message.UserRegistered);
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyMobileOtp(MobileOtpVerification objOtpVerification)
        {
            if (!ModelState.IsValid)
                this.BadRequestResponse(Message.InvalidRequest, ModelState);

            bool isOtpVerified = await _authService.VerifyMobileOtp(objOtpVerification);
            if (!isOtpVerified)
            {
                return this.OkResponse(false, Message.InvalidOtp);
            }

            try
            {
                if (objOtpVerification.Initiator?.ToLower() == "login")
                {
                    //User verified, proceed with login
                    string preAuth = _encryptionService.Decrypt(objOtpVerification.PreAuthToken);
                    string[] tokenParts = preAuth.Split('|');

                    if (tokenParts.Length != 3)
                    {
                        throw new ArgumentException(Message.TokenInvalid);
                    }

                    UserLoginDto user = await _authService.GetUserByIdAndRole(Convert.ToInt32(tokenParts[0]), Convert.ToInt16(tokenParts[1]));
                    string jwtAccessToken = _jwtService.GenerateAccessToken(user);

                    // Save and set refresh token
                    AuthRefreshToken refreshToken = new AuthRefreshToken();
                    refreshToken.UserId = user.Id;
                    refreshToken.RoleId = user.RoleId;
                    refreshToken.TokenHash = _jwtService.GenerateRefreshToken();
                    refreshToken.IpAddress = HttpContext.GetClientIpAddress();
                    refreshToken.ExpiresATUtc = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenLifetimeDays);

                    await _jwtService.SaveRefreshToken(refreshToken);

                    SetAccessCookie(jwtAccessToken, DateTime.UtcNow.AddDays(_jwtSettings.AccessTokenLifetimeMinutes));
                    SetRefreshCookie(refreshToken.TokenHash, refreshToken.ExpiresATUtc);

                    var responseData = new
                    {
                        accessToken = jwtAccessToken,
                        expiresIn = _jwtSettings.AccessTokenLifetimeMinutes * 60,
                    };

                    return this.OkResponse(responseData, Message.LoginSuccess, true);
                }
            }
            catch(Exception ex)
            {
                return this.OkResponse(new { Initiator = "register" }, Message.OtpVerified);
            }

            return this.OkResponse(new { Initiator = "register" }, Message.OtpVerified );
        }

        [HttpGet("send-email-verification/users/{userid}/role/{roleid}")]
        public async Task<IActionResult> GenerateEmailVerification(string userid, string roleid)
        {
            if (string.IsNullOrEmpty(userid) || string.IsNullOrEmpty(roleid))
                return this.BadRequestResponse(Message.InvalidRequest);

            if (!int.TryParse(userid, out int _userId) || !short.TryParse(roleid, out short _roleId))
                return this.BadRequestResponse(Message.InvalidRequest);

            string ipAddress = HttpContext.GetClientIpAddress();
            
            bool isEmailSent = await _authService.SendEmailVerification(_userId, _roleId, ipAddress);
            if (!isEmailSent)
            {
                return this.BadRequestResponse(Message.InvalidRequest);
            }

            return this.OkResponse(true, Message.EmailSent);
        }

        [HttpGet("verify-email/{token}")]
        public async Task<IActionResult> VerifyEmail(string token)
        {
            if (string.IsNullOrEmpty(token) || !Guid.TryParse(token, out _))
                return this.BadRequestResponse(Message.InvalidRequest);

            bool isEmailVerified = await _authService.VerifyEmailGuid(token);
            if (!isEmailVerified)
            {
                return this.NotFoundResponse(Message.InvalidOrExpiredLink);
            }
            return this.OkResponse(true, Message.EmailVerified);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPassword forgotPass)
        {
            if (!ModelState.IsValid)
                this.BadRequestResponse(Message.InvalidRequest, ModelState);

            UserLoginDto user = await _authService.GetUserByEmailOrMobile(forgotPass.UserName);
            if (user == null || user.Id < 1)
            {
                return this.NotFoundResponse(Message.UserNotFound);
            }

            string ipAddress = HttpContext.GetClientIpAddress();
            bool isEmailSent = await _authService.SendForgotPasswordLink(user, ipAddress);
            if (!isEmailSent)
            {
                return this.BadRequestResponse(Message.InvalidRequest);
            }

            return this.OkResponse(true, Message.EmailSent);
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPassword resetPass)
        {
            if (!ModelState.IsValid)
                this.BadRequestResponse(Message.InvalidRequest, ModelState);

            string ipAddress = HttpContext.GetClientIpAddress();
            string? userName = await _authService.ResetPassword(resetPass, ipAddress);
            if (string.IsNullOrEmpty(userName))
            {
                return this.BadRequestResponse(Message.InvalidOrExpiredLink);
            }

            UserLoginDto user = await _authService.GetUserByEmailOrMobile(userName);
            if (user == null || user.Id < 1)
            {
                return this.NotFoundResponse(Message.UserNotFound);
            }

            await _authService.SendPasswordChangedEmail(user, ipAddress);

            return this.OkResponse(true, Message.PasswordResetSuccess);
        }


        [AllowAnonymous]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            if (Request.Cookies.TryGetValue("plan_refreshToken", out var cookie) && !string.IsNullOrEmpty(cookie))
            {
                await _jwtService.DeleteRefreshTokenByHash(cookie);
            }

            // remove cookie
            Response.Cookies.Delete("rahul_refreshToken", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/",
                Domain = ".eClaims.com"
            });

            //Response.Cookies.Delete("rahul_accessToken", new CookieOptions
            //{
            //    HttpOnly = true,
            //    Secure = true,
            //    SameSite = SameSiteMode.None,
            //    Path = "/",
            //    Domain = ".eClaims.com"
            //});

            return this.OkResponse(true, Message.LogoutSuccess);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            if (!Request.Cookies.TryGetValue("plan_refreshToken", out var cookie) || string.IsNullOrEmpty(cookie))
            {
                return Unauthorized();
            }

            AuthRefreshToken oldRefreshToken = await _jwtService.GetRefreshTokenByHash(cookie);
            if (oldRefreshToken == null || oldRefreshToken.ExpiresATUtc <= DateTime.UtcNow)
            {
                return Unauthorized();
            }

            //User verified, proceed with login
            UserLoginDto user = await _authService.GetUserByIdAndRole(oldRefreshToken.UserId, oldRefreshToken.RoleId);
            if (user == null || user.Id < 1)
            {
                return Unauthorized();
            }
            string jwtAccessToken = _jwtService.GenerateAccessToken(user);

            // Save and set refresh token
            AuthRefreshToken refreshToken = new AuthRefreshToken();
            refreshToken.Id = oldRefreshToken.Id;
            refreshToken.TokenHash = _jwtService.GenerateRefreshToken();
            refreshToken.IpAddress = HttpContext.GetClientIpAddress();
            refreshToken.ExpiresATUtc = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenLifetimeDays);
            refreshToken.ReplacedByTokenHash = oldRefreshToken.TokenHash;

            await _jwtService.ReplaceRefreshToken(refreshToken);

            SetAccessCookie(jwtAccessToken, DateTime.UtcNow.AddDays(_jwtSettings.AccessTokenLifetimeMinutes));
            SetRefreshCookie(refreshToken.TokenHash, refreshToken.ExpiresATUtc);

            var responseData = new
            {
                accessToken = jwtAccessToken,
                refreshToken = refreshToken.TokenHash,
            };

            return this.OkResponse(responseData, Message.TokenRefreshed, true);
        }

        private void SetAccessCookie(string accessToken, DateTime expiresAt)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Expires = expiresAt,
                SameSite = SameSiteMode.None,
                Path = "/",
                IsEssential = true,
                //Domain = ".rahulsharma.live"
            };
            Response.Cookies.Append("rahul_accessToken", accessToken, cookieOptions);
        }

        private void SetRefreshCookie(string tokenHash, DateTime expiresAt)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Expires = expiresAt,
                SameSite = SameSiteMode.None,
                Path = "/",
                IsEssential = true,
                //Domain = ".rahulsharma.live"
            };
            Response.Cookies.Append("rahul_refreshToken", tokenHash, cookieOptions);
        }
    }
}
