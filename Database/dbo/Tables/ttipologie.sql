CREATE TABLE [dbo].[ttipologie] (
    [tt_codint]        INT           IDENTITY (1, 1) NOT NULL,
    [tt_macrotipo_it]  VARCHAR (100) NOT NULL,
    [tt_tipologia1_it] VARCHAR (100) NOT NULL,
    [tt_tipologia2_it] VARCHAR (100) NOT NULL,
    CONSTRAINT [PK_ttipologie] PRIMARY KEY CLUSTERED ([tt_codint] ASC)
);

