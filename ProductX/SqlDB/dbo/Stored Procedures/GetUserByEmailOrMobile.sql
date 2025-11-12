-- =============================================
-- Author:		Rahul Sharma
-- Create date: 26-10-2025
-- Description:	<Description,,>
-- =============================================
CREATE     PROCEDURE [dbo].[GetUserByEmailOrMobile]
	@UserName NVARCHAR(255)
AS
BEGIN
	
	IF EXISTS(SELECT 1 FROM Users WHERE IsDeleted = 0 AND (Email = @UserName OR MobileNo = @UserName))
	BEGIN
		SELECT Id, FullName, Email, [Password], RoleId, MobileNo, IsMobileVerified, IsEmailVerified, LastLogin
		FROM Users WHERE IsDeleted = 0 AND (Email = @UserName OR MobileNo = @UserName)
	END

END