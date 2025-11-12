using eClaims.Models;

namespace eClaims.Services
{
    public interface IEmailService
    {
        public Task<bool> SendEmailAsync(EmailMsg obj);
    }
}
