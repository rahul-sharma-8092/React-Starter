
-- =============================================
-- Author:		Rahul Sharma
-- Create date: 01-11-2025
-- Description:	<Description,,>
-- =============================================
CREATE   PROCEDURE [dbo].[GetRefreshTokenByHash]
	@TokenHash NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;

    SELECT Id, UserId, RoleId, TokenHash, CreatedATUtc, ExpiresATUtc, DeletedATUtc, ReplacedByTokenHash, IpAddress 
	FROM AuthRefreshToken 
	WHERE TokenHash = @TokenHash AND IsDeleted = 0;
END