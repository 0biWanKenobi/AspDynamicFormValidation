CREATE TABLE [dbo].[ttipologie] (
    [tt_codint]        INT           IDENTITY (1, 1) NOT NULL,
    [tt_macrotipo_it]  VARCHAR (255) NOT NULL,
    [tt_tipologia1_it] VARCHAR (255) NOT NULL,
    [tt_tipologia2_it] VARCHAR (255) NOT NULL,
    CONSTRAINT [PK_TTIPOLOGIE] PRIMARY KEY CLUSTERED ([tt_codint] ASC)
);



