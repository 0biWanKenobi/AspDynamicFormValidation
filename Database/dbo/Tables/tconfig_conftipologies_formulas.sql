CREATE TABLE [dbo].[tconfig_conftipologies_formulas] (
    [ttf_formula_id]  INT NOT NULL,
    [ttf_tipology_id] INT NOT NULL,
    PRIMARY KEY CLUSTERED ([ttf_formula_id] ASC, [ttf_tipology_id] ASC),
    CONSTRAINT [FK_tconfig_conftipologies_formulas_ttf_formula_id] FOREIGN KEY ([ttf_formula_id]) REFERENCES [dbo].[tconfig_formulas] ([tcf_codint]),
    CONSTRAINT [FK_tconfig_conftipologies_formulas_ttf_tipology_id] FOREIGN KEY ([ttf_tipology_id]) REFERENCES [dbo].[tconfig_tipologie] ([tt_codint])
);




