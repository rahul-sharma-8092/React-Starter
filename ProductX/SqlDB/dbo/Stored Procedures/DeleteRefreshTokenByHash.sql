-- =============================================
-- Author:		Rahul Sharma
-- Create date: 01-11-2025
-- Description:	<Description,,>
-- =============================================
CREATE   PROCEDURE [dbo].[DeleteRefreshTokenByHash]
	@TokenHash NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;

    UPDATE AuthRefreshToken SET IsDeleted = 1 WHERE TokenHash = @TokenHash AND IsDeleted = 0

END