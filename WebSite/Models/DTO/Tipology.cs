using Newtonsoft.Json;

namespace WebSite.Models.DTO
{
    public class Tipology
    {
        [JsonProperty(PropertyName = "chosenMacroType")]       
        public TypeTuple MacroType { get; set; }
        
        [JsonProperty(PropertyName = "chosenTypeOne")]  
        public TypeTuple TypeOne { get; set; }
        
        [JsonProperty(PropertyName = "chosenTypeTwo")]  
        public TypeTuple TypeTwo { get; set; }
    }

    [JsonObject]
    public class TypeTuple
    {
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }

        [JsonProperty(PropertyName = "value")]
        public string Value { get; set; }
    }
}
