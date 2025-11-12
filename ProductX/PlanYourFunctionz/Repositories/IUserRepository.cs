using eClaims.Models.Auth;

namespace eClaims.Repositories
{
    public interface IUserRepository
    {
        public Task<bool> IsEmailUnique(string email);
        public Task<bool> IsMobileNoUnique(string mobileno);
        public Task<int> Register(Register registerDto);
    }
}
