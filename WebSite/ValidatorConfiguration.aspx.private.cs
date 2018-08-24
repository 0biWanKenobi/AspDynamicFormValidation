using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;
using DTOModels = WebSite.Models.DTO;

namespace WebSite
{
    public partial class ValidatorConfiguration
    {
        private static IEnumerable<DTOModels.FieldGroup> ExtractFieldGroup(JObject rule,  IEnumerable<string> ruleNameList)
        {
            return ruleNameList.Select( name =>
            {
                var fieldGroup = rule[name].ToObject<DTOModels.FieldGroup>();
                fieldGroup.Name = name;
                return fieldGroup;
            });
        }
    }
}
