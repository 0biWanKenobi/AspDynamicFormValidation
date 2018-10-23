using System.Data.Linq.Mapping;

namespace CCONTACT.Models.DAO
{
    [Table(Name = "tconfig_conftipologies_formulas")]
    public class ConfTipologyFormula
    {
        [Column(Name = "ttf_formula_id", IsPrimaryKey = true)]
        public int FormulaId { get; set; }

        [Column(Name = "ttf_tipology_id", IsPrimaryKey = true)]
        public int TipologyId { get; set; }
    }
    
}
