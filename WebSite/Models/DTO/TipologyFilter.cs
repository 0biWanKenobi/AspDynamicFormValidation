using Newtonsoft.Json;

namespace CCONTACT.Models.DTO
{
    public class TipologyFilter
    {
        [JsonProperty(PropertyName = "operator")]
        public string Operator { get; set; }

        [JsonProperty(PropertyName = "field")]
        public string Field { get; set; }

        [JsonProperty(PropertyName = "value")]
        public string Value { get; set; }
    }
}
