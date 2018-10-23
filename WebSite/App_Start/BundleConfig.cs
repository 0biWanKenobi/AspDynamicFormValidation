using System.Web.Optimization;

namespace CCONTACT
{
    public class BundleConfig
    {
        public static void Configure(BundleCollection collection)
        {
            BundleTable.EnableOptimizations = true;
            collection.Add(new ScriptBundle("~/bundle/js").Include("~/Scripts/Libraries/jQuery/jquery-{version}.min.js"));
            collection.Add(new ScriptBundle("~/bundle/kendoJs").Include("~/Scripts/Kendo/*.min.js"));

            collection.Add(new StyleBundle("~/bundle/css").Include("~/Styles/styles.css"));
            collection.Add(new StyleBundle("~/Styles/Kendo/css").Include("~/Styles/Kendo/*.css"));
        }
    }
}
