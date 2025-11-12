CREATE TABLE [dbo].[EmailVerification] (
    [Id]        INT           IDENTITY (1, 1) NOT NULL,
    [UserId]    INT           NULL,
    [RoleId]    SMALLINT      NULL,
    [Guid]      NVARCHAR (50) NULL,
    [IpAddress] NVARCHAR (45) NULL,
    [CreatedAT] DATETIME      DEFAULT (getutcdate()) NULL,
    [ExpiresAT] DATETIME      DEFAULT (dateadd(day,(7),getutcdate())) NULL,
    [IsDeleted] BIT           DEFAULT ((0)) NULL,
    [EmailType] NVARCHAR (20) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

