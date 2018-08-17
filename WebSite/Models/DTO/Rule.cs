using System.Collections.Generic;
using Newtonsoft.Json;

namespace WebSite.Models.DTO
{

    public class Rule
    {
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }
       
        [JsonProperty(PropertyName = "description")]
        public string Description { get; set; }

        [JsonProperty(PropertyName = "operator")]
        public string Operator { get; set; }
        
        [JsonProperty(PropertyName = "rulegroups")]
        public List<string> RuleFields { get; set; }

        public List<FieldGroup> RuleFieldDefinitions { get; set; }

        
        public string Formula { get; set; }
    }
}
