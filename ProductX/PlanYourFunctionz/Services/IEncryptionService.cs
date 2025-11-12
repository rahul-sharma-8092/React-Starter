namespace eClaims.Services
{
    public interface IEncryptionService
    {
        public string HashPassword(string password);
        public bool VerifyPassword(string password, string hashedPassword);
        public string Encrypt(string plainText);
        public string Decrypt(string cipherText);
    }
}
