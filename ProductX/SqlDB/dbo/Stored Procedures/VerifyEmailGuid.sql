-- =============================================
-- Author:		Rahul Sharma
-- Create date: 26-10-2025
-- Description:	<Description,,>
-- =============================================
CREATE     PROCEDURE [dbo].[VerifyEmailGuid]
	@Token NVARCHAR(50)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @Userd INT = 0;
	DECLARE @RoleId INT = 0;
	DECLARE @ReturnVal BIT = 0;
	DECLARE @EmailType NVARCHAR(20) = 'VerifyEmail'

    IF EXISTS(SELECT Id FROM EmailVerification WHERE [Guid] = @Token AND IsDeleted = 0 AND ExpiresAT >= GETUTCDATE() AND EmailType = @EmailType)
	BEGIN
		SELECT @Userd = UserId, @RoleId = RoleId FROM EmailVerification WHERE [Guid] = @Token AND IsDeleted = 0 AND ExpiresAT >= GETUTCDATE() AND EmailType = @EmailType;

		UPDATE Users SET IsEmailVerified = 1, UpdatedDate = GETDATE() WHERE Id = @Userd AND RoleId = @RoleId AND IsDeleted = 0 AND ISNULL(IsEmailVerified,0) = 0;

		UPDATE EmailVerification SET IsDeleted = 1 WHERE [Guid] = @Token AND IsDeleted = 0 AND EmailType = @EmailType;

		SET @ReturnVal = 1;
	END

	SELECT @ReturnVal AS Result;
END