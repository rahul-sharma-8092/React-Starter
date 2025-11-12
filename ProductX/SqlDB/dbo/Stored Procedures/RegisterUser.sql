-- =============================================
-- Author:		Rahul Sharma
-- Create date: 26-10-2025
-- Description:	<Description,,>
-- =============================================
CREATE     PROCEDURE [dbo].[RegisterUser]
	@FullName NVARCHAR(150),
	@Email NVARCHAR(255),
	@Password NVARCHAR(MAX),
	@Role SMALLINT,
	@MobileNo NVARCHAR(15),
	@Address NVARCHAR(500),
	@City NVARCHAR(100),
	@State NVARCHAR(100)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @UserId INT = 0;

    IF NOT EXISTS(SELECT Id FROM Users WHERE MobileNo = @MobileNo AND IsDeleted = 0)
	BEGIN
		INSERT INTO Users(FullName, Email, [Password], RoleId, MobileNo, [Address], City, [State])
		VALUES(@FullName, @Email, @Password, @Role, @MobileNo, @Address, @City, @State)

		SET @UserId = SCOPE_IDENTITY();
	END

	SELECT @UserId AS UserId;
END