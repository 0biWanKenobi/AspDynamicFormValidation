CREATE TABLE [dbo].[tconfig_rules] (
    [tr_codint]           INT           IDENTITY (1, 1) NOT NULL,
    [tr_name]             VARCHAR (100) NOT NULL,
    [tr_description]      VARCHAR (255) NOT NULL,
    [tr_formula]          INT           NOT NULL,
    [tr_prevRule]         INT           NULL,
    [tr_prevRuleOperator] CHAR (1)      NULL,
    CONSTRAINT [PK_TCONFIG_RULES] PRIMARY KEY CLUSTERED ([tr_codint] ASC),
    CONSTRAINT [fk_tconfig_rules_tconfig_formulas] FOREIGN KEY ([tr_formula]) REFERENCES [dbo].[tconfig_formulas] ([tcf_codint]) ON UPDATE CASCADE
);



