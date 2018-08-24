CREATE TABLE [dbo].[tconfig_formulas] (
    [tcf_codint]       INT           IDENTITY (1, 1) NOT NULL,
    [tcf_name]         VARCHAR (100) NOT NULL,
    [tcf_description]  VARCHAR (100) NOT NULL,
    [tcf_tipologia_id] INT           NOT NULL,
    CONSTRAINT [PK_TCONFIG_FORMULAS] PRIMARY KEY CLUSTERED ([tcf_codint] ASC),
    CONSTRAINT [fk_tconfig_formulas_ttipologie] FOREIGN KEY ([tcf_tipologia_id]) REFERENCES [dbo].[ttipologie] ([tt_codint]) ON UPDATE CASCADE
);



