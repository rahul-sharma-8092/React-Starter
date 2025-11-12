-- =============================================
-- Author:		Rahul Sharma
-- Create date: 26-10-2025
-- Description:	<Description,,>
-- =============================================
CREATE     PROCEDURE [dbo].[GenerateEmailVerification]
	@UserId INT,
	@RoleId SMALLINT,
	@Guid NVARCHAR(50),
	@IpAddress NVARCHAR(45),
	@EmailType NVARCHAR(20),
	@ExpiresAT DATETIME

AS
BEGIN
	SET NOCOUNT ON;

	IF EXISTS(SELECT * FROM Users WHERE Id = @UserId AND RoleId = @RoleId AND IsDeleted = 0 AND (ISNULL(IsEmailVerified,0) = 0 OR @EmailType != 'VerifyEmail'))
	BEGIN
		UPDATE EmailVerification SET IsDeleted = 1 WHERE UserId = @UserId AND RoleId = @RoleId AND IsDeleted = 0 AND EmailType=@EmailType;

		INSERT INTO EmailVerification(UserId, RoleId, [Guid], IpAddress, ExpiresAT, EmailType)
		VALUES(@UserId, @RoleId, @Guid, @IpAddress, @ExpiresAT, @EmailType);

		SELECT E.UserId, E.RoleId, U.FullName, U.Email, E.[Guid], E.IpAddress
		FROM EmailVerification E
		INNER JOIN Users U ON U.Id = E.UserId 
		WHERE U.IsDeleted = 0 AND E.IsDeleted = 0 AND UserId = @UserId AND E.RoleId = @RoleId AND EmailType=@EmailType
	END
	
END