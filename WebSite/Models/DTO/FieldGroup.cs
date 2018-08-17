using System.Collections.Generic;
using Newtonsoft.Json;


namespace WebSite.Models.DTO
{
    public class FieldGroup
    {
        public string Name {get; set;}

        [JsonProperty(PropertyName = "fieldNames")]
        public List<string> FieldList { get; set; }

        [JsonProperty(PropertyName = "operator")]
        public string LogicOperator {get; set; }

        [JsonProperty(PropertyName = "prevRuleGroupRelationship")]
        public string PrevGroupLogicOperator { get; set; }

        [JsonProperty(PropertyName ="field1")]
        public int? Field1 { get; set; }

        [JsonProperty(PropertyName ="field2")]
        public int? Field2 { get; set; }

        [JsonProperty(PropertyName ="field3")]
        public int? Field3 { get; set; }

        [JsonProperty(PropertyName ="field4")]
        public int? Field4 { get; set; }

        [JsonProperty(PropertyName ="field5")]
        public int? Field5 { get; set; }
    }
}
