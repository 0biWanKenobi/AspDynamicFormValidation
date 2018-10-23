CREATE TABLE [dbo].[tconfig_tipologies_formulas] (
    [ttf_formula_id]  INT NOT NULL,
    [ttf_tipology_id] INT NOT NULL,
    PRIMARY KEY CLUSTERED ([ttf_formula_id] ASC, [ttf_tipology_id] ASC)
);



