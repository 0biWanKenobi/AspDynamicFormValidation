CREATE TABLE [dbo].[tconfig_fieldgroup] (
    [tf_codint]            INT           IDENTITY (1, 1) NOT NULL,
    [tf_name]              VARCHAR (100) NOT NULL,
    [tf_prevGroupOperator] VARCHAR (1)   NULL,
    [tf_operator]          VARCHAR (1)   NULL,
    [tf_rule_id]           INT           NOT NULL,
    [tf_prevGroup]         INT           NULL,
    CONSTRAINT [PK_TCONFIG_FIELDGROUP] PRIMARY KEY CLUSTERED ([tf_codint] ASC),
    CONSTRAINT [fk_tconfig_fieldgroup_tconfig_rules] FOREIGN KEY ([tf_rule_id]) REFERENCES [dbo].[tconfig_rules] ([tr_codint]) ON UPDATE CASCADE
);



