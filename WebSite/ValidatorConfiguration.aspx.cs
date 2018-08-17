using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web.Script.Services;
using System.Web.Services;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using WebSite.Business;
using System.Text.RegularExpressions;
using WebSite.Models.DTO;


namespace WebSite
{
    public partial class ValidatorConfiguration : System.Web.UI.Page
    {
        public List<Rule> Rules;
        private static readonly Regex ClearRuleJson = new Regex(@"\r\n|\s+");
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod, ScriptMethod]
        public static HttpResponseMessage SaveConfiguration(string configuration)
        {
            dynamic config = JsonConvert.DeserializeObject(configuration);
            var ruleNameList = ((JArray)config.ruleNames).ToObject<List<string>>();
            var ruleList = ruleNameList.Select(ruleName =>
            {
                var rule = (JObject)config[ruleName];
                var fieldGroups = rule["rulegroups"].ToObject<string[]>().Select( name =>
                {
                    var fieldGroup = rule[name].ToObject<FieldGroup>();
                    fieldGroup.Name = name;
                    return fieldGroup;
                });

                var dtoRule = rule.ToObject<Rule>();
                dtoRule.RuleFieldDefinitions = fieldGroups.ToList();
                return dtoRule;
            });

            //TO-DO call method must be UpdateValidationConfig when updating
            // and SaveValidationConfig when creating from scratch
            DataLayer.UpdateValidationConfig(1, ruleList);

            return new HttpResponseMessage()
            {
                Content = new StringContent("{'result': 'OK'}", Encoding.UTF8, "application/json")
            };
        }
    }
}