using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Script.Services;
using System.Web.Services;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using WebSite.Business;
using WebSite.Models.DTO;


namespace WebSite
{
    public partial class ValidatorConfiguration : System.Web.UI.Page
    {
        private static readonly Regex ClearRuleJson = new Regex(@"\r\n|[\s]{2,}");
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod, ScriptMethod]
        public static HttpResponseMessage SaveConfiguration(string configuration)
        {
            dynamic config = JsonConvert.DeserializeObject(configuration);

            var formula = ((JObject) config.formula).ToObject<Formula>();
            var tipologies = ((JArray) config.tipologies).ToObject<List<Tipology>>();

            var ruleNameList = ((JArray)config.ruleNames).ToObject<List<string>>();
            var ruleList = ruleNameList.Select(ruleName =>
            {
                var rule = (JObject)config[ruleName];
                var fieldGroups = ExtractFieldGroup(rule, ruleNameList);
                var dtoRule = rule.ToObject<Rule>();
                dtoRule.RuleFieldDefinitions = fieldGroups.ToList();
                return dtoRule;
            });

            // Having a formula Id means that it exists on db
            // because the Id is the row number
            if(formula.Id.HasValue)
                DataLayer.UpdateValidationConfig(formula.Id.Value, ruleList, tipologies);
            else
                DataLayer.SaveValidationConfig(1, formula, ruleList);

            return new HttpResponseMessage()
            {
                Content = new StringContent("{'result': 'OK'}", Encoding.UTF8, "application/json")
            };
        }

        [WebMethod, ScriptMethod]
        public static string LoadConfiguration(Tipology tipology)
        {

            var configuration =
                DataLayer
                    .LoadValidationConfig(tipology.MacroType, tipology.TypeOne, tipology.TypeTwo)
                    .ToString()
                    .Replace("\"", "\\\"");
            return $"{{\"configuration\":\"{ClearRuleJson.Replace(configuration,"")}\"}}";

        }

        [WebMethod, ScriptMethod]
        public static string LoadMacrotypes()
        {
            var macrotypes = DataLayer.LoadMacrotypes();
            return $"{{\"macrotypes\":{JsonConvert.SerializeObject(macrotypes)} }}";
        }

        [WebMethod, ScriptMethod]
        public static string LoadTipologies(TipologyFilter[] filters)
        {
            var tipologies = DataLayer.LoadTipologies(filters.FirstOrDefault()?.Value);
            return $"{{\"tipologies\":{JsonConvert.SerializeObject(tipologies)} }}";
        }

        [WebMethod, ScriptMethod]
        public static string LoadSubtypes(TipologyFilter[] filters)
        {
            var macrotype = filters.FirstOrDefault(f => f.Field ==  "macrotype")?.Value;
            var tipology = filters.FirstOrDefault(f => f.Field == "tipology")?.Value;
            var subtypes = DataLayer.LoadSubtypes(macrotype, tipology);
            return $"{{\"subtypes\":{JsonConvert.SerializeObject(subtypes)} }}";
        }
    }
}