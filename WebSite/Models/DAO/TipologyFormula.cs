﻿using System.Data.Linq.Mapping;


namespace WebSite.Models.DAO
{
    /**
     * Association table between formulas and tipologies.
     * Used to generate validation xml. 
     */
    [Table(Name = "tconfig_tipologies_formulas")]
    public class TipologyFormula
    {
        [Column(Name = "ttf_formula_id")]
        public int FormulaId { get; set; }

        [Column(Name = "ttf_tipology_id")]
        public int TipologyId { get; set; }
    }
}
