CREATE TABLE [dbo].[Users] (
    [Id]               INT            IDENTITY (1, 1) NOT NULL,
    [FullName]         NVARCHAR (150) NOT NULL,
    [Email]            NVARCHAR (255) NULL,
    [Password]         NVARCHAR (MAX) NULL,
    [RoleId]           SMALLINT       DEFAULT ((3)) NULL,
    [MobileNo]         NVARCHAR (15)  NULL,
    [AltMobileNo]      NVARCHAR (15)  NULL,
    [Address]          NVARCHAR (500) NULL,
    [City]             NVARCHAR (100) NULL,
    [State]            NVARCHAR (100) NULL,
    [IsMobileVerified] BIT            DEFAULT ((0)) NULL,
    [LastLogin]        DATETIME       NULL,
    [IsDeleted]        BIT            DEFAULT ((0)) NULL,
    [CreatedDate]      DATETIME       DEFAULT (getdate()) NULL,
    [UpdatedDate]      DATETIME       DEFAULT (getdate()) NULL,
    [IsEmailVerified]  BIT            DEFAULT ((0)) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [UQ_Users_MobileNo] UNIQUE NONCLUSTERED ([MobileNo] ASC)
);






GO
