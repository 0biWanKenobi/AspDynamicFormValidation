using System.Collections.Generic;
using System.Linq;
using CCONTACT.Models.DTO;
using Newtonsoft.Json.Linq;

namespace CCONTACT
{
    public partial class ValidatorConfiguration
    {
        private static IEnumerable<FieldGroup> ExtractFieldGroup(JObject rule)
        {
            return rule["rulegroups"].ToObject<List<string>>().Select( name =>
            {
                var fieldGroup = rule[name].ToObject<FieldGroup>();
                fieldGroup.Name = name;
                return fieldGroup;
            });
        }
    }
}
