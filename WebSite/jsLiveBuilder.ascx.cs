using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Web.UI;
using Rule = WebSite.Models.DTO.Rule;

namespace WebSite
{
    public partial class JsLiveBuilder : UserControl
    {
        public string XmlConfiguration;
        private static readonly Regex ClearRuleJson = new Regex(@"\r\n|[\s]{2,}");

        protected void Page_Load(object sender, EventArgs e)
        {
            var stringXml = Business.DataLayer.LoadValidationConfig(1).ToString();
            XmlConfiguration  = ClearRuleJson.Replace(stringXml,"").Replace("\"", "\\\"");
        }
    }
}