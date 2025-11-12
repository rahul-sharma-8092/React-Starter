CREATE TABLE [dbo].[AuthRefreshToken] (
    [Id]                  INT            IDENTITY (1, 1) NOT NULL,
    [UserId]              INT            NOT NULL,
    [RoleId]              SMALLINT       NOT NULL,
    [TokenHash]           NVARCHAR (MAX) NOT NULL,
    [CreatedATUtc]        DATETIME       DEFAULT (getutcdate()) NOT NULL,
    [ExpiresATUtc]        DATETIME       DEFAULT (dateadd(day,(30),getutcdate())) NOT NULL,
    [DeletedATUtc]        DATETIME       NULL,
    [ReplacedByTokenHash] NVARCHAR (MAX) NULL,
    [IpAddress]           NVARCHAR (45)  NULL,
    [IsDeleted]           BIT            DEFAULT ((0)) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

