﻿using Newtonsoft.Json;

namespace CCONTACT.Models.DTO
{
    public class Tipology
    {
        [JsonProperty(PropertyName = "chosenTipologyId")] 
        public int? Id { get; set; }

        [JsonProperty(PropertyName = "chosenMacroType")]       
        public string MacroType { get; set; }
        
        [JsonProperty(PropertyName = "chosenTypeOne")]  
        public string TypeOne { get; set; }
        
        [JsonProperty(PropertyName = "chosenTypeTwo")]  
        public string TypeTwo { get; set; }
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
