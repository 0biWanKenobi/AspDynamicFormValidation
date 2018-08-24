using Newtonsoft.Json;

namespace WebSite.Models.DTO
{
    public class Formula
    {
        [JsonProperty(PropertyName = "id")]
        public  int? Id { get; set; }

        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }

        [JsonProperty(PropertyName = "description")]
        public string Description { get; set; }

        [JsonProperty(PropertyName = "ruleCount")]
        public int RuleCount { get; set; }

        [JsonProperty(PropertyName = "isNew")]
        public bool IsNew { get; set; }
    }
}
