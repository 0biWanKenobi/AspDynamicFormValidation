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
using WebSite.Models;
using WebSite.Models.DAO;
using System.Text.RegularExpressions;

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
            foreach (var ruleName in ruleNameList)
            {

                var rule = (JObject)config[ruleName];
                
                DataLayer.SaveValidationConfig(
                    flowId:             rule.Value<int>("flowId"),
                    ruleName:           ruleName,
                    jsonRuleDefinition: ClearRuleJson.Replace(rule.ToString(), ""),
                    ruleDescription:     rule.Value<string>("description").Trim()
                );

            }

            return new HttpResponseMessage()
            {
                Content = new StringContent("{'result': 'OK'}", Encoding.UTF8, "application/json")
            };
        }
    }
}