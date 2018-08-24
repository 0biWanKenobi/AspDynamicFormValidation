using System.Data.Linq.Mapping;
using System.Xml.Linq;

namespace WebSite.Models.DAO
{
    [Table(Name = "vconfig_formula_definitions")]
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
