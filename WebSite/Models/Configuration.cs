using System.Data.Linq.Mapping;

namespace WebSite.Models
{
    [Table(Name = "vconfig_validation")]
    public class Configuration
    {
        [Column(Name = "config_formula")]
        public string ConfigFormula {get; set;}

        [Column(Name = "config_formula_definition")]
        public string ConfigFormulaDefinition {get; set;}

        [Column(Name = "rule_id")]
        public int RuleId {get; set;}

        [Column(Name = "rule_definition")]
        public string RuleDefinition {get; set;}

        [Column(Name = "tcrs_field1_used")]
        public bool TcrsField1Used {get; set;}

        [Column(Name = "tcrs_field2_used")]
        public bool TcrsField2Used {get; set;}

        [Column(Name = "tcrs_field3_used")]
        public bool TcrsField3Used {get; set;}

        [Column(Name = "tcrs_field4_used")]
        public bool TcrsField4Used {get; set;}

        [Column(Name = "tcrs_field5_used")]
        public bool TcrsField5Used {get; set;}
    }
}
