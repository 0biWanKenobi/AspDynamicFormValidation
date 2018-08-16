using System.Data.Linq.Mapping;

namespace WebSite.Models.DAO
{
    [Table(Name = "tconfig_rulefields")]
    public class RuleFields
    {
        [Column(Name = "tcrs_codint", IsPrimaryKey = true)]
        public int Id { get; set; }

        [Column(Name="tcrs_field1_used")]
        public bool Field1Enabled {get; set; }


        [Column(Name="tcrs_field2_used")]
        public bool Field2Enabled {get; set; }


        [Column(Name="tcrs_field3_used")]
        public bool Field3Enabled {get; set; }


        [Column(Name="tcrs_field4_used")]
        public bool Field4Enabled {get; set; }


        [Column(Name="tcrs_field5_used")]
        public bool Field5Enabled {get; set; }
    }
}
