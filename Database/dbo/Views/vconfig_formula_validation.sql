CREATE VIEW dbo.vconfig_formula_validation 
AS SELECT
  tcf_codint AS Id  
 ,(SELECT (
		SELECT ttf.ttf_tipology_id AS [@Id],
				tt_macrotipo_it as [@Macrotype],
				tt_tipologia1_it as [@TypeOne],
				tt_tipologia2_it as [@TypeTwo]
		FROM tconfig_tipologies_formulas ttf 
		inner join ttipologie on ttf_tipology_id = tt_codint
		WHERE ttf.ttf_formula_id = tf.tcf_codint
		FOR XML PATH('Tipology'), TYPE, ELEMENTS
	  ) FOR XML PATH('Tipologies'), TYPE) as Tipologies
 ,(SELECT
      tcf_codint AS [@Id]	  
     ,tf.tcf_name AS [@Name]
	 
     ,tf.tcf_description AS [Description]
     ,tr.tr_codint AS [Rule/@Id]
     ,tr.tr_name AS [Rule/@Name]
     ,tr.tr_description AS [Rule/Description]
     ,tr.tr_prevrule AS [Rule/PreviousRule]
     ,[Rule/FieldGroups] = (SELECT
          tf1.tf_codint AS [@Id]
         ,tf1.tf_name AS [@Name]
         ,tf1.tf_prevgroupoperator AS [PrevGroupOperator]
         ,tf1.tf_operator AS [Operator]
         ,tf1.tf_prevgroup AS [PrevGroup]
         ,[Fields] = (SELECT
              tf2.tf_name AS [@Name]
             ,tf2.tf_codint AS [@Id]
            FROM tconfig_fields tf2
            INNER JOIN tconfig_fieldgroup_fields tff
              ON tf1.tf_codint = tff.tff_fieldgroup_id
            WHERE tff.tff_field_id = tf2.tf_codint
            FOR XML PATH ('Field'), TYPE, ELEMENTS)
        FROM tconfig_fieldgroup tf1
        WHERE tr.tr_codint = tf1.tf_rule_id
        FOR XML PATH ('FieldGroup'), TYPE, ELEMENTS)
    FOR XML PATH ('Formula'), TYPE)
  AS Definition
FROM tconfig_formulas tf
INNER JOIN tconfig_rules tr
  ON tf.tcf_codint = tr.tr_formula
GO
EXECUTE sp_addextendedproperty @name = N'MS_DiagramPaneCount', @value = 1, @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'VIEW', @level1name = N'vconfig_formula_validation';


GO
EXECUTE sp_addextendedproperty @name = N'MS_DiagramPane1', @value = N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[28] 4[12] 2[42] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 1440
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'VIEW', @level1name = N'vconfig_formula_validation';

