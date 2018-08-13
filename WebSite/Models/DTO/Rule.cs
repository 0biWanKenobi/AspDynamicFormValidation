using System.Data.Linq.Mapping;

namespace WebSite.Models.DTO
{

    public class Rule
    {
        public int Id { get; set; }

        public string Name { get; set; }
       
        public string Definition { get; set; }
        
        public string RuleFields { get; set; }

        public string Formula { get; set; }
    }
}
