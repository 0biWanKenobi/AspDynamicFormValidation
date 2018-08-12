CREATE TABLE [dbo].[tconfig_formulas] (
    [tcf_codint]          INT           IDENTITY (1, 1) NOT NULL,
    [tcf_formula]         VARCHAR (500) NOT NULL,
    [tcf_formula_name]    VARCHAR (50)  NOT NULL,
    [tcf_flow_identifier] INT           NOT NULL,
    CONSTRAINT [PK_tconfig_formulas] PRIMARY KEY CLUSTERED ([tcf_codint] ASC)
);

