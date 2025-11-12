-- =============================================
-- Author:		Rahul Sharma
-- Create date: 25-10-2025
-- Description:	<Description,,>
-- =============================================
CREATE   PROCEDURE [dbo].[SaveRefreshToken]
	@UserId INT,
	@RoleId SMALLINT,
	@TokenHash NVARCHAR(MAX),
	@IpAddress NVARCHAR(45)
AS
BEGIN
	SET NOCOUNT ON;

	--UPDATE AuthRefreshToken SET IsDeleted = 1 WHERE UserId = @UserId AND RoleId = @RoleId AND IsDeleted = 0;

    INSERT INTO AuthRefreshToken(UserId, RoleId, TokenHash, IpAddress)
	VALUES(@UserId, @RoleId, @TokenHash, @IpAddress)

END