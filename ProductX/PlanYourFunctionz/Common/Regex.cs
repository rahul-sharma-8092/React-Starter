namespace eClaims.Common
{
    public static class Regex
    {
        // 🔐 Password
        // Must contain at least one uppercase, one lowercase, one number, one special char, 8–20 length
        public const string PasswordPattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$";

        // 📧 Email
        // Standard RFC 5322 simplified version (commonly used)
        //public const string EmailPattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$";
        public const string EmailPattern = @"^(?!.*\.\.)[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,63}[A-Za-z0-9])?@([A-Za-z0-9-]+\.)+[A-Za-z]{2,63}$";

        // 📱 Indian Mobile Number
        // Allows 10 digits starting with 6–9, optional +91 or 91 prefix
        public const string IndianMobilePattern = @"^(?:\+91|91)?[6-9]\d{9}$";

        // ☎️ International Phone Number
        // Allows country code, spaces, dashes, parentheses
        public const string InternationalPhonePattern = @"^\+?\d{1,3}?[- .]?\(?\d{1,4}\)?[- .]?\d{3,4}[- .]?\d{3,4}$";

        // 🆔 Aadhaar Number (12 digits)
        public const string AadhaarPattern = @"^\d{12}$";

        // 🧾 PAN Number (Permanent Account Number - India)
        // Format: 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F)
        public const string PanPattern = @"^[A-Z]{5}[0-9]{4}[A-Z]{1}$";

        // 💼 GSTIN (15-character alphanumeric)
        // Format: 2 digits (state code) + 10 PAN chars + 1 entity code + Z + 1 check code
        public const string GstPattern = @"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$";

        // 📍 Pin Code (India)
        public const string IndianPinCodePattern = @"^[1-9][0-9]{5}$";

        // 🧑 Name (Alphabetic, allows space, dot, and hyphen)
        public const string NamePattern = @"^[A-Za-z\s'.-_]+$";

        // 🏠 Address (Alphanumeric with special characters allowed)
        public const string AddressPattern = @"^[A-Za-z0-9\s,.'\-/#()]+$";

        // 🌐 URL (Basic validation)
        public const string UrlPattern = @"^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$";

        // 💸 Amount (Numeric with up to 2 decimal places)
        public const string AmountPattern = @"^\d+(\.\d{1,2})?$";

        // 🔢 Numeric (only digits)
        public const string NumericPattern = @"^\d+$";

        // 🔡 Alphabetic (only letters)
        public const string AlphabeticPattern = @"^[A-Za-z]+$";

        // 🔤 Alphanumeric
        public const string AlphaNumericPattern = @"^[A-Za-z0-9]+$";

        // 🆎 AlphaNumeric with spaces
        public const string AlphaNumericSpacePattern = @"^[A-Za-z0-9\s]+$";

        // 🔠 Username (Letters, digits, underscore, 3–50 chars)
        public const string UsernamePattern = @"^[A-Za-z0-9_]{3,50}$";

        // 🪪 OTP (4–6 digits)
        public const string OtpPattern = @"^\d{4,6}$";

        // 📧 File Name (No special invalid file system chars)
        public const string FileNamePattern = @"^[^\\/:*?""<>|]+$";

        // 📅 Date (yyyy-mm-dd or dd/mm/yyyy)
        public const string DatePattern = @"^(?:(?:19|20)\d\d)[- /.](0[1-9]|1[0-2])[- /.](0[1-9]|[12][0-9]|3[01])$";

        // 📅 Date (dd-mm-yyyy or dd/mm/yyyy or dd.mm.yyyy)
        public const string Date_DDMMYYYY_Pattern = @"^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[0-2])[- /.](19|20)\d\d$";

        // ⏰ DateTime 24-hour (yyyy-mm-dd HH:mm:ss or dd/mm/yyyy HH:mm:ss)
        public const string DateTime24_Pattern = @"^(?:(?:19|20)\d\d[- /.](0[1-9]|1[0-2])[- /.](0[1-9]|[12][0-9]|3[01]))[ T](?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$";

        // ⏰ DateTime 12-hour with AM/PM (dd/mm/yyyy hh:mm:ss AM/PM)
        public const string DateTimeAMPM_Pattern = @"^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[0-2])[- /.](19|20)\d\d[ ](0[1-9]|1[0-2]):[0-5]\d(?::[0-5]\d)?[ ]?(AM|PM|am|pm)$";

        // ⏰ ISO 8601 (2025-10-12T13:45:00Z)
        public const string ISODateTime_Pattern = @"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$";
    }
}
