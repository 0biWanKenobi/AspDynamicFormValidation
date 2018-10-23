using System.Collections.Generic;
using Newtonsoft.Json;

namespace CCONTACT.Models.DTO
{

    public class Rule
    {

        [JsonProperty(PropertyName = "id")]
        public int? Id { get; set; }

        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }
       
        [JsonProperty(PropertyName = "description")]
        public string Description { get; set; }
        
        [JsonProperty(PropertyName = "rulegroups")]
        public List<string> RuleFields { get; set; }

        public List<FieldGroup> RuleFieldDefinitions { get; set; }

        [JsonProperty(PropertyName = "removedFieldGroupIds")]
        public List<int> RemovedFieldGroupIds { get; set; }
        
    }
}
