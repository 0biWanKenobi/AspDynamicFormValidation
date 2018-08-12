CREATE TABLE [dbo].[tconfig_formula_rules] (
    [tfr_codint]  INT IDENTITY (1, 1) NOT NULL,
    [tfr_formula] INT NOT NULL,
    [tfr_rule]    INT NOT NULL,
    CONSTRAINT [PK_tconfig_formula_rules] PRIMARY KEY CLUSTERED ([tfr_codint] ASC),
    CONSTRAINT [FK_tconfig_formula_rules_tconfig_formulas] FOREIGN KEY ([tfr_formula]) REFERENCES [dbo].[tconfig_formulas] ([tcf_codint]),
    CONSTRAINT [FK_tconfig_formula_rules_tconfig_rules] FOREIGN KEY ([tfr_rule]) REFERENCES [dbo].[tconfig_rules] ([tcv_codint])
);

