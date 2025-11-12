USE [ReactStarter]
GO
/****** Object:  Table [dbo].[AuthRefreshToken]    Script Date: 13-11-2025 02:35:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AuthRefreshToken](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[RoleId] [smallint] NOT NULL,
	[TokenHash] [nvarchar](max) NOT NULL,
	[CreatedATUtc] [datetime] NOT NULL,
	[ExpiresATUtc] [datetime] NOT NULL,
	[DeletedATUtc] [datetime] NULL,
	[ReplacedByTokenHash] [nvarchar](max) NULL,
	[IpAddress] [nvarchar](45) NULL,
	[IsDeleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Cities]    Script Date: 13-11-2025 02:35:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Cities](
	[Id] [int] NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[State] [nvarchar](10) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EmailVerification]    Script Date: 13-11-2025 02:35:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EmailVerification](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NULL,
	[RoleId] [smallint] NULL,
	[Guid] [nvarchar](50) NULL,
	[IpAddress] [nvarchar](45) NULL,
	[CreatedAT] [datetime] NULL,
	[ExpiresAT] [datetime] NULL,
	[IsDeleted] [bit] NULL,
	[EmailType] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OtpDetails]    Script Date: 13-11-2025 02:35:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OtpDetails](
	[OtpId] [bigint] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NULL,
	[RoleId] [smallint] NULL,
	[MobileNo] [nvarchar](15) NULL,
	[OtpCode] [nvarchar](10) NOT NULL,
	[OtpType] [nvarchar](50) NOT NULL,
	[IsUsed] [bit] NULL,
	[ExpiresAt] [datetime] NULL,
	[IpAddress] [nvarchar](45) NULL,
	[CreatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[OtpId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[States]    Script Date: 13-11-2025 02:35:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[States](
	[Id] [int] NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[Code] [nvarchar](10) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 13-11-2025 02:35:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FullName] [nvarchar](150) NOT NULL,
	[Email] [nvarchar](255) NULL,
	[Password] [nvarchar](max) NULL,
	[RoleId] [smallint] NULL,
	[MobileNo] [nvarchar](15) NULL,
	[AltMobileNo] [nvarchar](15) NULL,
	[Address] [nvarchar](500) NULL,
	[City] [nvarchar](100) NULL,
	[State] [nvarchar](100) NULL,
	[IsMobileVerified] [bit] NULL,
	[LastLogin] [datetime] NULL,
	[IsDeleted] [bit] NULL,
	[CreatedDate] [datetime] NULL,
	[UpdatedDate] [datetime] NULL,
	[IsEmailVerified] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_Users_MobileNo] UNIQUE NONCLUSTERED 
(
	[MobileNo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Index [IX_OtpDetails_UserRole_ExpiresAt]    Script Date: 13-11-2025 02:35:11 ******/
CREATE NONCLUSTERED INDEX [IX_OtpDetails_UserRole_ExpiresAt] ON [dbo].[OtpDetails]
(
	[UserId] ASC,
	[RoleId] ASC,
	[ExpiresAt] ASC
)
INCLUDE([OtpType],[OtpCode],[IsUsed],[MobileNo],[CreatedAt]) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AuthRefreshToken] ADD  DEFAULT (getutcdate()) FOR [CreatedATUtc]
GO
ALTER TABLE [dbo].[AuthRefreshToken] ADD  DEFAULT (dateadd(day,(30),getutcdate())) FOR [ExpiresATUtc]
GO
ALTER TABLE [dbo].[AuthRefreshToken] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[EmailVerification] ADD  DEFAULT (getutcdate()) FOR [CreatedAT]
GO
ALTER TABLE [dbo].[EmailVerification] ADD  DEFAULT (dateadd(day,(7),getutcdate())) FOR [ExpiresAT]
GO
ALTER TABLE [dbo].[EmailVerification] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[OtpDetails] ADD  DEFAULT (dateadd(minute,(10),getutcdate())) FOR [ExpiresAt]
GO
ALTER TABLE [dbo].[OtpDetails] ADD  DEFAULT (getutcdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((3)) FOR [RoleId]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [IsMobileVerified]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [UpdatedDate]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [IsEmailVerified]
GO
/****** Object:  StoredProcedure [dbo].[DeleteRefreshTokenByHash]    Script Date: 13-11-2025 02:35:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Rahul Sharma
-- Create date: 01-11-2025
-- Description:	<Description,,>
-- =============================================
CREATE     PROCEDURE [dbo].[DeleteRefreshTokenByHash]
	@TokenHash NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;

    UPDATE AuthRefreshToken SET IsDeleted = 1 WHERE TokenHash = @TokenHash AND IsDeleted = 0

END
GO
/****** Object:  StoredProcedure [dbo].[GenerateEmailVerification]    Script Date: 13-11-2025 02:35:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
GO
/****** Object:  StoredProcedure [dbo].[GetRefreshTokenByHash]    Script Date: 13-11-2025 02:35:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Rahul Sharma
-- Create date: 01-11-2025
-- Description:	<Description,,>
-- =============================================
CREATE     PROCEDURE [dbo].[GetRefreshTokenByHash]
	@TokenHash NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;

    SELECT Id, UserId, RoleId, TokenHash, CreatedATUtc, ExpiresATUtc, DeletedATUtc, ReplacedByTokenHash, IpAddress 
	FROM AuthRefreshToken 
	WHERE TokenHash = @TokenHash AND IsDeleted = 0;
END
GO
/****** Object:  StoredProcedure [dbo].[GetUserByEmailOrMobile]    Script Date: 13-11-2025 02:35:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
GO
/****** Object:  StoredProcedure [dbo].[GetUserByIdAndRole]    Script Date: 13-11-2025 02:35:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
GO
/****** Object:  StoredProcedure [dbo].[IsEmailAndMobileUnique]    Script Date: 13-11-2025 02:35:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
GO
/****** Object:  StoredProcedure [dbo].[RegisterUser]    Script Date: 13-11-2025 02:35:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
GO
/****** Object:  StoredProcedure [dbo].[ReplaceRefreshToken]    Script Date: 13-11-2025 02:35:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Rahul Sharma
-- Create date: 01-11-2025
-- Description:	<Description,,>
-- =============================================
CREATE     PROCEDURE [dbo].[ReplaceRefreshToken]
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
GO
/****** Object:  StoredProcedure [dbo].[ResetPassword]    Script Date: 13-11-2025 02:35:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Rahul Sharma
-- Create date: 26-10-2025
-- Description:	<Description,,>
-- =============================================
CREATE     PROCEDURE [dbo].[ResetPassword]
	@Token NVARCHAR(50),
	@NewPassword NVARCHAR(MAX),
	@IpAddress NVARCHAR(45)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @UserId INT = 0;
	DECLARE @RoleId INT = 0;
    DECLARE @ReturnVal NVARCHAR(50) = '';
	DECLARE @EmailType NVARCHAR(20) = 'ResetPassword';

	IF EXISTS(Select Id FROM EmailVerification WHERE IsDeleted = 0 AND EmailType = @EmailType AND [Guid] = @Token AND ExpiresAT >= GETUTCDATE())
	BEGIN
		SELECT @UserId = UserId, @RoleId = RoleId FROM EmailVerification WHERE [Guid] = @Token AND IsDeleted = 0 AND ExpiresAT >= GETUTCDATE() AND EmailType = @EmailType;

		UPDATE Users SET [Password] = @NewPassword, UpdatedDate = GETDATE() WHERE Id = @UserId AND IsDeleted = 0;

		SELECT @ReturnVal = MobileNo FROM Users WHERE Id = @UserId AND IsDeleted = 0 AND RoleId = @RoleId;

		UPDATE EmailVerification SET IsDeleted = 1, IpAddress = @IpAddress WHERE [Guid] = @Token AND IsDeleted = 0 AND EmailType = @EmailType;
	END

	SELECT @ReturnVal AS Result;
END
GO
/****** Object:  StoredProcedure [dbo].[SaveMobileOtp]    Script Date: 13-11-2025 02:35:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Rahul Sharma
-- Create date: 26-10-2025
-- Description:	Generates and stores a one-time password (OTP) for a user
-- =============================================
CREATE     PROCEDURE [dbo].[SaveMobileOtp]
    @UserId INT,
    @RoleId SMALLINT,
	@MobileNo NVARCHAR(15),
    @OtpCode NVARCHAR(10),
    @OtpType NVARCHAR(50),
    @IpAddress NVARCHAR(45)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ResultVal BIGINT;

	UPDATE OtpDetails SET IsUsed = 1 where IsUsed = 0 AND UserId = @UserId AND RoleId = @RoleId AND OtpType = @OtpType;

    INSERT INTO OtpDetails (UserId, RoleId, MobileNo, OtpCode, OtpType, IpAddress, ExpiresAt, CreatedAt)
    VALUES (@UserId, @RoleId, @MobileNo, @OtpCode, @OtpType, @IpAddress, DATEADD(MINUTE, 15, GETUTCDATE()), GETUTCDATE());

    SET @ResultVal = SCOPE_IDENTITY();

    SELECT @ResultVal AS Result;
END
GO
/****** Object:  StoredProcedure [dbo].[SaveRefreshToken]    Script Date: 13-11-2025 02:35:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Rahul Sharma
-- Create date: 25-10-2025
-- Description:	<Description,,>
-- =============================================
CREATE     PROCEDURE [dbo].[SaveRefreshToken]
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
GO
/****** Object:  StoredProcedure [dbo].[VerifyEmailGuid]    Script Date: 13-11-2025 02:35:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
GO
/****** Object:  StoredProcedure [dbo].[VerifyOtpAndActivateAccount]    Script Date: 13-11-2025 02:35:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Rahul Sharma
-- Create date: 26-10-2025
-- Description:	<Description,,>
-- =============================================
CREATE     PROCEDURE [dbo].[VerifyOtpAndActivateAccount]
	@UserId INT,
	@RoleId SMALLINT,
	@OtpCode NVARCHAR(10),
	@OtpType NVARCHAR(50)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @ReturnVal BIT = 0;
    
	IF EXISTS(SELECT 1 FROM OtpDetails WHERE ISNULL(IsUsed,0) = 0 AND ExpiresAt >= GETUTCDATE() AND UserId = @UserId AND RoleId = @RoleId AND OtpCode = @OtpCode AND OtpType = @OtpType)
	BEGIN
		UPDATE Users SET IsMobileVerified = 1 WHERE IsDeleted = 0 AND Id = @UserId AND RoleId = @RoleId;

		UPDATE OtpDetails SET IsUsed = 1 WHERE ISNULL(IsUsed,0) = 0 AND UserId = @UserId AND RoleId = @RoleId AND OtpCode = @OtpCode AND OtpType = @OtpType;

		SET @ReturnVal = 1;
	END

	SELECT @ReturnVal AS Result;

END
GO
