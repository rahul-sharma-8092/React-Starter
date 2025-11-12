namespace eClaims.Common
{
    public static class Message
    {
        // 🧩 General / System
        public const string Success = "Success.";
        public const string Failed = "Failed.";
        public const string InternalServerError = "Internal Server Error.";
        public const string InvalidRequest = "Invalid request data.";
        public const string SomethingWrong = "Something went wrong. Please try again later.";
        public const string ServiceUnavailable = "Service is temporarily unavailable.";
        public const string DataProcessingError = "Error while processing data.";
        public const string NotFound = "The requested resource was not found on the server.";
        public const string MethodNotAllowed = "The requested method is not allowed on this endpoint.";
        public const string RequestTimeout = "The request has timed out. Please try again.";
        public const string Conflict = "A conflict occurred while processing your request.";
        public const string TooManyRequests = "Too many requests. Please wait for some time and try again.";
        public const string ServerError = "Server encountered an error while processing your request.";
        public const string BadGateway = "Bad gateway. Please try again later.";
        public const string ServiceTimeout = "The service did not respond in time.";
        public const string GatewayTimeout = "Gateway timeout. Please try again later.";

        // 🔒 Authentication / Authorization
        public const string Unauthorized = "Access denied. Please log in to continue.";
        public const string Forbidden = "You do not have permission to perform this action.";
        public const string InvalidCredentials = "Invalid username or password.";
        public const string AccountLocked = "Your account has been locked. Please contact support.";
        public const string TokenExpired = "Session expired. Please log in again.";
        public const string TokenInvalid = "Invalid authentication token.";
        public const string TokenRefreshed = "Auth token refreshed successfully.";
        public const string PasswordChanged = "Password changed successfully.";
        public const string PasswordResetSuccess = "Password reset successfully.";
        public const string PasswordResetFailed = "Password reset failed.";
        public const string InvalidOtp = "Otp has been invalid or expired.";
        public const string OtpSent = "OTP has been sent successfully.";
        public const string OtpVerified = "OTP verified successfully. please login";
        public const string LoginSuccess = "Login successful.";
        public const string LoginFailed = "Login failed. Please check credentials.";
        public const string LogoutSuccess = "User logout successfully.";

        // 👤 User
        public const string UserRegistered = "User registered successfully.";
        public const string UserMobileAlreadyExists = "User already exists with this mobile number.";
        public const string UserEmailAlreadyExists = "User already exists with this email.";
        public const string UserAlreadyExists = "User already exists with email or mobile no.";
        public const string UserNotFound = "User not found.";
        public const string UserUpdated = "User details updated successfully.";
        public const string UserDeleted = "User deleted successfully.";
        public const string AcceptTermsCondition = "Please accept the Terms & Conditions.";
        public const string PasswordValidationFailed = "Password must be 6-20 characters and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.";
        public const string InvalidConfirmPassword = "Password and Confirm password do not match.";
        public const string InvalidPasswordLength = "Password must be between 6 and 20 characters.";
        public const string InvalidMobileNumber = "Invalid mobile number.";
        public const string EmailVerified = "Email verified successfully.";
        public const string InvalidOrExpiredLink = "Invalid or expired verification link. Please generate new link.";

        // 🎟️ Events
        public const string EventCreated = "Event created successfully.";
        public const string EventUpdated = "Event updated successfully.";
        public const string EventDeleted = "Event deleted successfully.";
        public const string EventNotFound = "Event not found.";
        public const string EventAlreadyExists = "Event with similar details already exists.";
        public const string EventListed = "Event list fetched successfully.";

        // 💰 Payment / Membership
        public const string PaymentSuccess = "Payment completed successfully.";
        public const string PaymentFailed = "Payment failed. Please try again.";
        public const string MembershipActive = "Membership is active.";
        public const string MembershipExpired = "Membership has expired.";
        public const string MembershipUpgraded = "Membership upgraded successfully.";

        // ⚠️ Validation
        public const string ValidationError = "One or more validation errors occurred.";
        public const string FieldRequired = "Required field is missing.";
        public const string DuplicateRecord = "Duplicate record found.";
        public const string InvalidData = "Invalid data provided.";
        public const string DataNotFound = "Requested data not found.";

        // ⚙️ Common CRUD
        public const string RecordAdded = "Record added successfully.";
        public const string RecordUpdated = "Record updated successfully.";
        public const string RecordDeleted = "Record deleted successfully.";
        public const string RecordNotFound = "Record not found.";

        // 📨 Communication
        public const string SmsSent = "SMS sent successfully.";
        public const string SmsFailed = "Failed to send SMS.";
        public const string EmailSent = "Email sent successfully.";
        public const string EmailFailed = "Failed to send email.";

        public const string InvalidGST = "Invalid GST number";
        public const string RequiredServicesOffered = "Select at least one Service";
        public const string RequiredCityOfferd = "Select at least one City";
        public const string RequiredStateOfferd = "Select at least one State";

    }
}
