CREATE TABLE [dbo].[tconfig_rulefields] (
    [tcrs_codint]      INT IDENTITY (1, 1) NOT NULL,
    [tcrs_field1_used] BIT CONSTRAINT [DF_tconfig_rulefields_tcrs_field1_used] DEFAULT ((0)) NULL,
    [tcrs_field2_used] BIT CONSTRAINT [DF_tconfig_rulefields_tcrs_field2_used] DEFAULT ((0)) NULL,
    [tcrs_field3_used] BIT CONSTRAINT [DF_tconfig_rulefields_tcrs_field3_used] DEFAULT ((0)) NULL,
    [tcrs_field4_used] BIT CONSTRAINT [DF_tconfig_rulefields_tcrs_field4_used] DEFAULT ((0)) NULL,
    [tcrs_field5_used] BIT CONSTRAINT [DF_tconfig_rulefields_tcrs_field5_used] DEFAULT ((0)) NULL,
    CONSTRAINT [PK_tconfig_rulefields] PRIMARY KEY CLUSTERED ([tcrs_codint] ASC)
);

