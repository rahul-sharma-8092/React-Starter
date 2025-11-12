CREATE TABLE [dbo].[OtpDetails] (
    [OtpId]     BIGINT        IDENTITY (1, 1) NOT NULL,
    [UserId]    INT           NULL,
    [RoleId]    SMALLINT      NULL,
    [MobileNo]  NVARCHAR (15) NULL,
    [OtpCode]   NVARCHAR (10) NOT NULL,
    [OtpType]   NVARCHAR (50) NOT NULL,
    [IsUsed]    BIT           NULL,
    [ExpiresAt] DATETIME      DEFAULT (dateadd(minute,(10),getutcdate())) NULL,
    [IpAddress] NVARCHAR (45) NULL,
    [CreatedAt] DATETIME      DEFAULT (getutcdate()) NULL,
    PRIMARY KEY CLUSTERED ([OtpId] ASC)
);






GO
CREATE NONCLUSTERED INDEX [IX_OtpDetails_UserRole_ExpiresAt]
    ON [dbo].[OtpDetails]([UserId] ASC, [RoleId] ASC, [ExpiresAt] ASC)
    INCLUDE([OtpType], [OtpCode], [IsUsed], [MobileNo], [CreatedAt]);

