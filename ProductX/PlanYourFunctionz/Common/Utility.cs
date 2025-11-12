using System.Security.Cryptography;

namespace eClaims.Common
{
    public static class Utility
    {
        public static string GenerateSixDigitOtp()
        {
            int code;
            using (var rng = RandomNumberGenerator.Create())
            {
                var bytes = new byte[4];
                rng.GetBytes(bytes);
                code = BitConverter.ToInt32(bytes, 0) % 1000000;
                code = Math.Abs(code);
            }
            return code.ToString("D6");
        }

        public static string GenerateSixDigit()
        {
            var random = new Random();
            int code = random.Next(1, 1000000);
            
            return code.ToString("D6");
        }

        public static string MaskMobileNumber(string number)
        {
            if (number.Length <= 4)
                return number;

            var firstTwo = number.Substring(0, 2);
            var lastTwo = number.Substring(number.Length - 2);
            var maskedMiddle = new string('x', number.Length - 4);

            return $"{firstTwo}{maskedMiddle}{lastTwo}";
        }
    }
}
