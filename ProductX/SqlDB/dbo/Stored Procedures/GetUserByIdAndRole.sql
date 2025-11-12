-- =============================================
-- Author:		Rahul Sharma
-- Create date: 01-11-2025
-- Description:	<Description,,>
-- =============================================
CREATE     PROCEDURE [dbo].[GetUserByIdAndRole]
	@UserId INT,
	@RoleId SMALLINT
AS
BEGIN
	
	SELECT Id, FullName, Email, [Password], RoleId, MobileNo, IsMobileVerified, IsEmailVerified, LastLogin
	FROM Users WHERE IsDeleted = 0 AND Id = @UserId AND RoleId = @RoleId

END