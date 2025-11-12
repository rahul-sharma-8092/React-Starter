-- =============================================
-- Author:		Rahul Sharma
-- Create date: 25-10-2025
-- Description:	Check Email or Mobile Unique?
-- =============================================
CREATE     PROCEDURE [dbo].[IsEmailAndMobileUnique]
	@Email NVARCHAR(250),
	@Mobile NVARCHAR(15),
	@Type NVARCHAR(10)
AS
BEGIN
	
	SET NOCOUNT ON;
	
	DECLARE @ReturnVal BIT = 1;

	IF(@Type = 'mobile')
	BEGIN
		IF EXISTS(SELECT Id FROM Users WHERE IsDeleted = 0 AND MobileNo = @Mobile)
		BEGIN
			SET @ReturnVal = 0;
		END
	END
	ELSE IF(@Type = 'email')
	BEGIN
		IF EXISTS(SELECT Id FROM Users WHERE IsDeleted = 0 AND Email = @Email)
		BEGIN
			SET @ReturnVal = 0;
		END
	END
	ELSE IF(@Type = 'both')
	BEGIN
		IF EXISTS(SELECT Id FROM Users WHERE IsDeleted = 0 AND (Email = @Email OR MobileNo = @Mobile))
		BEGIN
			SET @ReturnVal = 0;
		END
	END
	
	SELECT @ReturnVal AS ReturnValue;

END