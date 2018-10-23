using System.Data.Linq.Mapping;

namespace CCONTACT.Models.DAO
{
    [Table(Name = "tconfig_formulas")]
    public class Formula
    {
        [Column(Name = "tcf_codint", IsPrimaryKey = true, IsDbGenerated = true)]
        public int Id { get; set; }

        [Column(Name = "tcf_name")]
        public string Name { get; set; }

        [Column(Name = "tcf_description")]
        public string Description { get; set; }

        [Column(Name = "tcf_tipologia_id")]
        public int Tipology { get; set; }
    }
}
