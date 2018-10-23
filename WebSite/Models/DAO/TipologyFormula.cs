using System.Data.Linq.Mapping;

namespace CCONTACT.Models.DAO
{
    /**
     * Association table between formulas and tipologies.
     * Used to generate validation xml. 
     */
    [Table(Name = "tconfig_tipologies_formulas")]
    public class TipologyFormula
    {
        [Column(Name = "ttf_formula_id", IsPrimaryKey = true)]
        public int FormulaId { get; set; }

        [Column(Name = "ttf_tipology_id", IsPrimaryKey = true)]
        public int TipologyId { get; set; }
    }
}
