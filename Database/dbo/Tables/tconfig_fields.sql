CREATE TABLE [dbo].[tconfig_fields] (
    [tf_codint] INT           IDENTITY (1, 1) NOT NULL,
    [tf_name]   VARCHAR (255) NOT NULL,
    CONSTRAINT [PK_TCONFIG_FIELDS] PRIMARY KEY CLUSTERED ([tf_codint] ASC)
);

