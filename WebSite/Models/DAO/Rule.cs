using System.Data.Linq.Mapping;

namespace WebSite.Models.DAO
{
    [Table(Name = "tconfig_rules")]
    public class Rule
    {
        [Column(Name = "tr_codint", IsPrimaryKey = true, IsDbGenerated = true)]
        public int Id { get; set; }

        [Column(Name = "tr_name")]
        public string Name { get; set; }

        [Column(Name = "tr_description")]
        public string Description { get; set; }

        [Column(Name = "tr_formula")]
        public int Formula { get; set; }

        [Column(Name = "tr_operator")]
        public string Operator { get; set; }

        [Column(Name = "tr_prevRule")]
        public int? PrevRule { get; set; }

       
    }
}
