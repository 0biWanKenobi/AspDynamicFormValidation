using System.Data.Linq.Mapping;

namespace WebSite.Models.DAO
{
    [Table(Name = "tconfig_rules")]
    public class Rule
    {
        [Column(Name = "tcv_codint", IsPrimaryKey = true)]
        public int Id { get; set; }

        [Column(Name = "tcv_rulename")]
        public string Name { get; set; }

        [Column(Name = "tcv_rule")]
        public string Definition { get; set; }

        [Column(Name = "tcv_rulefields_set")]
        public int RuleFields { get; set; }

        [Column(Name = "tcv_rule_description")]
        public string Description { get; set; }
    }
}
