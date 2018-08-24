CREATE TABLE [dbo].[tconfig_fieldgroup_fields] (
    [tff_codint]        INT IDENTITY (1, 1) NOT NULL,
    [tff_field_id]      INT NOT NULL,
    [tff_fieldgroup_id] INT NOT NULL,
    CONSTRAINT [PK_TCONFIG_FIELDGROUP_FIELDS] PRIMARY KEY CLUSTERED ([tff_codint] ASC),
    CONSTRAINT [fk_tconfig_fieldgroup_fields_tconfig_fieldgroup] FOREIGN KEY ([tff_fieldgroup_id]) REFERENCES [dbo].[tconfig_fieldgroup] ([tf_codint]) ON UPDATE CASCADE,
    CONSTRAINT [fk_tconfig_fieldgroup_fields_tconfig_fields] FOREIGN KEY ([tff_field_id]) REFERENCES [dbo].[tconfig_fields] ([tf_codint]) ON UPDATE CASCADE
);

