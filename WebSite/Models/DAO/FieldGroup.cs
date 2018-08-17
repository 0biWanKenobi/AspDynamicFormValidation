using System.Data.Linq.Mapping;

namespace WebSite.Models.DAO
{
    [Table(Name = "tconfig_fieldgroup")]
    public class FieldGroup
    {
        [Column(Name = "tf_codint", IsPrimaryKey = true, IsDbGenerated = true)]
        public int Id { get; set; }

        [Column(Name = "tf_name")]
        public string Name { get; set; }

        [Column(Name = "tf_prevGroupOperator")]
        public string PrevGroupOperator { get; set; }

        [Column(Name = "tf_operator")]
        public string Operator { get; set; }

        [Column(Name = "tf_rule_id")]
        public int RuleId { get; set; }

        [Column(Name = "tf_prevGroup")]
        public int? PrevGroupId { get; set; }
    }
}
