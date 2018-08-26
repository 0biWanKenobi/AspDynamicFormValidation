CREATE TABLE [dbo].[tconfig_tipologie]
(
	[tt_codint]        INT           IDENTITY (1, 1) NOT NULL,
	[tt_macrotipo_it]  VARCHAR (255) NOT NULL,
	[tt_tipologia1_it] VARCHAR (255)     NULL,
	[tt_tipologia2_it] VARCHAR (255)     NULL,
	CONSTRAINT [PK_TCONFIGTIPOLOGIE] PRIMARY KEY CLUSTERED ([tt_codint] ASC)
)
