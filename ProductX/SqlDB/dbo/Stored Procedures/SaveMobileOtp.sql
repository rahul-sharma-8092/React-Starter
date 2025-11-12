-- =============================================
-- Author:		Rahul Sharma
-- Create date: 26-10-2025
-- Description:	Generates and stores a one-time password (OTP) for a user
-- =============================================
CREATE   PROCEDURE [dbo].[SaveMobileOtp]
    @UserId INT,
    @RoleId SMALLINT,
	@MobileNo NVARCHAR(15),
    @OtpCode NVARCHAR(10),
    @OtpType NVARCHAR(50),
    @IpAddress NVARCHAR(45)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ResultVal BIGINT;

	UPDATE OtpDetails SET IsUsed = 1 where IsUsed = 0 AND UserId = @UserId AND RoleId = @RoleId AND OtpType = @OtpType;

    INSERT INTO OtpDetails (UserId, RoleId, MobileNo, OtpCode, OtpType, IpAddress, ExpiresAt, CreatedAt)
    VALUES (@UserId, @RoleId, @MobileNo, @OtpCode, @OtpType, @IpAddress, DATEADD(MINUTE, 15, GETUTCDATE()), GETUTCDATE());

    SET @ResultVal = SCOPE_IDENTITY();

    SELECT @ResultVal AS Result;
END