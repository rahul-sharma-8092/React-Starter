CREATE TABLE [dbo].[Cities] (
    [Id]    INT            NOT NULL,
    [Name]  NVARCHAR (255) NOT NULL,
    [State] NVARCHAR (10)  NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

