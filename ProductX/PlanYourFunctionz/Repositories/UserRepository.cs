using Microsoft.Extensions.Options;
using eClaims.AppSettings;
using eClaims.Models.Auth;

namespace eClaims.Repositories
{
    public class UserRepository : BaseSQL, IUserRepository
    {
        public UserRepository(IOptions<ConnectionStrings> options) : base(options)
        {
        }

        public Task<bool> IsEmailUnique(string email)
        {
            throw new NotImplementedException();
        }

        public Task<bool> IsMobileNoUnique(string mobileno)
        {
            throw new NotImplementedException();
        }

        public Task<int> Register(Register registerDto)
        {
            throw new NotImplementedException();
        }
    }
}
