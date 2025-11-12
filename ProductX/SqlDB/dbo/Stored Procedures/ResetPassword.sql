-- =============================================
-- Author:		Rahul Sharma
-- Create date: 26-10-2025
-- Description:	<Description,,>
-- =============================================
CREATE     PROCEDURE [dbo].[ResetPassword]
	@Token NVARCHAR(50),
	@NewPassword NVARCHAR(MAX),
	@IpAddress NVARCHAR(45)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @UserId INT = 0;
	DECLARE @RoleId INT = 0;
    DECLARE @ReturnVal NVARCHAR(50) = '';
	DECLARE @EmailType NVARCHAR(20) = 'ResetPassword';

	IF EXISTS(Select Id FROM EmailVerification WHERE IsDeleted = 0 AND EmailType = @EmailType AND [Guid] = @Token AND ExpiresAT >= GETUTCDATE())
	BEGIN
		SELECT @UserId = UserId, @RoleId = RoleId FROM EmailVerification WHERE [Guid] = @Token AND IsDeleted = 0 AND ExpiresAT >= GETUTCDATE() AND EmailType = @EmailType;

		UPDATE Users SET [Password] = @NewPassword, UpdatedDate = GETDATE() WHERE Id = @UserId AND IsDeleted = 0;

		SELECT @ReturnVal = MobileNo FROM Users WHERE Id = @UserId AND IsDeleted = 0 AND RoleId = @RoleId;

		UPDATE EmailVerification SET IsDeleted = 1, IpAddress = @IpAddress WHERE [Guid] = @Token AND IsDeleted = 0 AND EmailType = @EmailType;
	END

	SELECT @ReturnVal AS Result;
END