using System.Data.Linq.Mapping;

namespace WebSite.Models.DAO
{
    [Table(Name = "tconfig_conftipologies_formulas")]
    public class ConfTipologyFormula
    {
        [Column(Name = "ttf_formula_id")]
        public int FormulaId { get; set; }

        [Column(Name = "ttf_tipology_id")]
        public int TipologyId { get; set; }
    }
    
}
