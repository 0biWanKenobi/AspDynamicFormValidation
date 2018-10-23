using System.Data.Linq.Mapping;
using System.Xml.Linq;

namespace CCONTACT.Models.DAO
{
    /**
     * This table is used by the validation script.
     * It has a row for each tipology actually bound to a formula.
     */
    [Table(Name = "vconfig_formula_validation")]
    public class Validation
    {
        [Column(Name = "Id")]
        public int IdFormula {get; set;}

        [Column(Name = "Tipologies")]
        public XElement Tipologie {get; set;}

        [Column(Name = "Definition")]
        public XElement FormulaDefinition {get; set;}
    }
}
