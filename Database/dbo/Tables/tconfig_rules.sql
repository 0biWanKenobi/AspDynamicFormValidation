CREATE TABLE [dbo].[tconfig_rules] (
    [tcv_codint]           INT           IDENTITY (1, 1) NOT NULL,
    [tcv_rule]             VARCHAR (500) NOT NULL,
    [tcv_rulename]         VARCHAR (50)  NOT NULL,
    [tcv_rulefields_set]   INT           NOT NULL,
    [tcv_rule_description] VARCHAR (500) NOT NULL,
    CONSTRAINT [PK_tconfig_validation] PRIMARY KEY CLUSTERED ([tcv_codint] ASC),
    CONSTRAINT [FK_tconfig_validation_tconfig_rulefields] FOREIGN KEY ([tcv_rulefields_set]) REFERENCES [dbo].[tconfig_rulefields] ([tcrs_codint]),
    CONSTRAINT [IX_tconfig_validation] UNIQUE NONCLUSTERED ([tcv_codint] ASC)
);

