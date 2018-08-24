using System.Data.Linq.Mapping;

namespace WebSite.Models.DAO
{
    [Table(Name = "ttipologie")]
    public class Tipology
    {
        [Column(Name = "tt_codint", IsPrimaryKey = true, IsDbGenerated = true)]
        public int Id { get; set; }

        [Column(Name = "tt_macrotipo_it")]
        public string MacroType { get; set; }

        [Column(Name = "tt_tipologia1_it")]
        public string TypeOne { get; set; }
        
        [Column(Name = "tt_tipologia2_it")]
        public string TypeTwo { get; set; }
    }
}
