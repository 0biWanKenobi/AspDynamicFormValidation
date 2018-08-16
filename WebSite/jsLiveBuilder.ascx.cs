using System;
using System.Collections.Generic;
using System.Web.UI;
using Rule = WebSite.Models.DTO.Rule;

namespace WebSite
{
    public partial class JsLiveBuilder : UserControl
    {
        public List<Rule> RuleDefinitions = new List<Rule>();
        public string JsonConfiguration;

        protected void Page_Load(object sender, EventArgs e)
        {
            JsonConfiguration = "\"{}\"";
            RuleDefinitions = Business.DataLayer.LoadValidationConfig();
        }
    }
}