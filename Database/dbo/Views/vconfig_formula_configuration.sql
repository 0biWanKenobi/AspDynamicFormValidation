CREATE VIEW dbo.vconfig_formula_configuration 
AS SELECT
  tcf_codint AS Id  
 ,(SELECT (
		SELECT tt.tt_codint AS [@Id],
				tt_macrotipo_it as [@Macrotype],
				tt_tipologia1_it as [@TypeOne],
				tt_tipologia2_it as [@TypeTwo]
		FROM tconfig_tipologie tt
		WHERE EXISTS (SELECT NULL FROM tconfig_conftipologies_formulas ttf 
    WHERE ttf_tipology_id = tt_codint AND  ttf.ttf_formula_id = tf.tcf_codint)	
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
			 , tff_codint AS [FieldId]
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