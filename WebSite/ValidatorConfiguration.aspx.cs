using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Web.Script.Services;
using System.Web.Services;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using WebSite.Business;
using WebSite.Models;
using WebSite.Models.DAO;

namespace WebSite
{
    public partial class ValidatorConfiguration : System.Web.UI.Page
    {
        public List<Rule> Rules;
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod, ScriptMethod]
        public static HttpResponseMessage SaveConfiguration(string configuration)
        {
            dynamic config = JsonConvert.DeserializeObject(configuration);
            foreach (JProperty rule in config)
            {
                var ruleDefinition = rule.Value.ToString();
                var associatedFlow = (int)rule.Value["flowId"];
                var ruleName = rule.Name;
                DataLayer.SaveValidationConfig(
                    flowId:             (int)rule.Value["flowId"],
                    ruleName:            rule.Name,
                    jsonRuleDefinition: rule.Value.ToString(),
                    ruleDescription:     (string)rule.Value["description"]
                );

            }

            return new HttpResponseMessage()
            {
                Content = new StringContent("{'result': 'OK'}", Encoding.UTF8, "application/json")
            };
        }
    }
}