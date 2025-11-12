-- =============================================
-- Author:		Rahul Sharma
-- Create date: 01-11-2025
-- Description:	<Description,,>
-- =============================================
CREATE   PROCEDURE [dbo].[ReplaceRefreshToken]
	@Id INT,
	@TokenHash NVARCHAR(MAX),
	@IpAddress NVARCHAR(45),
	@ExpiresATUtc DATETIME,
	@ReplacedByTokenHash NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;

    UPDATE AuthRefreshToken
		SET TokenHash = @TokenHash, ReplacedByTokenHash = @ReplacedByTokenHash,
			ExpiresATUtc = @ExpiresATUtc, IpAddress = @IpAddress
	WHERE IsDeleted = 0 AND Id = @Id;

END