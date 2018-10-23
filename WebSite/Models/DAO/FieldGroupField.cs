using System.Data.Linq.Mapping;

namespace CCONTACT.Models.DAO
{
    [Table(Name = "tconfig_fieldgroup_fields")]
    public class FieldGroupField
    {
        [Column(Name = "tff_codint", IsPrimaryKey = true, IsDbGenerated = true)]
        public int Id { get; set; }

        [Column(Name = "tff_field_id")]
        public int FieldId { get; set; }

        [Column(Name = "tff_fieldgroup_id")]
        public int FieldGroupId { get; set; }
    }
}
