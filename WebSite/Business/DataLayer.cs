using System.Collections.Generic;
using System.Configuration;
using System.Data.Linq;
using System.Data.OleDb;
using System.Linq;
using WebSite.Models;
using Configuration = WebSite.Models.Configuration;

namespace WebSite.Business
{
    public partial class DataLayer
    {
        private static readonly string ConnectionString = ConfigurationManager.ConnectionStrings["localDB"].ConnectionString;
        public static List<Rule> LoadValidationConfig()
        {
            using(var dbConnection = new OleDbConnection(ConnectionString))
            using(var dataContext = new DataContext(dbConnection))
            {
                dbConnection.Open();
                var configurations = dataContext.GetTable<Configuration>();

                return configurations.Select(c =>

                    new Rule
                    {
                          Id = c.RuleId
                        , Definition = TranscodeRule(c.RuleDefinition, c.TcrsField1Used, c.TcrsField2Used, c.TcrsField3Used, c.TcrsField4Used, c.TcrsField5Used)
                        , RuleFields = GenerateFieldList(c.TcrsField1Used, c.TcrsField2Used, c.TcrsField3Used, c.TcrsField4Used, c.TcrsField5Used)
                        , Formula = c.ConfigFormulaDefinition
                    }
                ).ToList();

            }
        }

        
    }
}
