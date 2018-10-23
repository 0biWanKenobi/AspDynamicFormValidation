using System.Data.Linq.Mapping;
using System.Xml.Linq;

namespace CCONTACT.Models.DAO
{
    /**
     * This table is used by the configuration utility
     * It loads tipologies in the same way as the admin saved them
     */
    [Table(Name = "vconfig_formula_configuration")]
    public class Configuration
    {
        [Column(Name = "Id")]
        public int IdFormula {get; set;}

        [Column(Name = "Tipologies")]
        public XElement Tipologie {get; set;}

        [Column(Name = "Definition")]
        public XElement FormulaDefinition {get; set;}
    }
}
