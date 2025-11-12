-- =============================================
-- Author:		Rahul Sharma
-- Create date: 26-10-2025
-- Description:	<Description,,>
-- =============================================
CREATE     PROCEDURE [dbo].[VerifyOtpAndActivateAccount]
	@UserId INT,
	@RoleId SMALLINT,
	@OtpCode NVARCHAR(10),
	@OtpType NVARCHAR(50)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @ReturnVal BIT = 0;
    
	IF EXISTS(SELECT 1 FROM OtpDetails WHERE ISNULL(IsUsed,0) = 0 AND ExpiresAt >= GETUTCDATE() AND UserId = @UserId AND RoleId = @RoleId AND OtpCode = @OtpCode AND OtpType = @OtpType)
	BEGIN
		UPDATE Users SET IsMobileVerified = 1 WHERE IsDeleted = 0 AND Id = @UserId AND RoleId = @RoleId;

		UPDATE OtpDetails SET IsUsed = 1 WHERE ISNULL(IsUsed,0) = 0 AND UserId = @UserId AND RoleId = @RoleId AND OtpCode = @OtpCode AND OtpType = @OtpType;

		SET @ReturnVal = 1;
	END

	SELECT @ReturnVal AS Result;

END