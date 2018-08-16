using System.Collections.Generic;
using System.Configuration;
using System.Data.Linq;
using System.Data.OleDb;
using System.Linq;
using DtoModels = WebSite.Models.DTO;
using DaoModels = WebSite.Models.DAO;

namespace WebSite.Business
{
    public partial class DataLayer
    {
        private static readonly string ConnectionString = ConfigurationManager.ConnectionStrings["localDB"].ConnectionString;
        public static List<DtoModels.Rule> LoadValidationConfig()
        {
            using(var dbConnection = new OleDbConnection(ConnectionString))
            using(var dataContext = new ConfigurationContext(dbConnection))
            {
                dbConnection.Open();
                return dataContext.Configurations.Select(c =>

                    new DtoModels.Rule
                    {
                          Id = c.RuleId
                        , Definition = TranscodeRule(c.RuleDefinition, c.TcrsField1Used, c.TcrsField2Used, c.TcrsField3Used, c.TcrsField4Used, c.TcrsField5Used)
                        , RuleFields = GenerateFieldList(c.TcrsField1Used, c.TcrsField2Used, c.TcrsField3Used, c.TcrsField4Used, c.TcrsField5Used)
                        , Formula = c.ConfigFormulaDefinition
                    }
                ).ToList();

            }
        }

        public static void SaveValidationConfig(int flowId, string ruleName, string jsonRuleDefinition, string ruleDescription, params bool[] usedFields)
        {
            using(var dbConnection = new OleDbConnection(ConnectionString))
            using (var dataContext = new ConfigurationContext(dbConnection))
            {
                dbConnection.Open();
                

                var ruleFieldSet = new DaoModels.RuleFields
                {
                    Field1Enabled = usedFields[0],
                    Field2Enabled = usedFields[1],
                    Field3Enabled = usedFields[2],
                    Field4Enabled = usedFields[3],
                    Field5Enabled = usedFields[4],
                };

                dataContext.RuleFields.InsertOnSubmit(ruleFieldSet);

                dataContext.Rules.InsertOnSubmit(new DaoModels.Rule
                {
                    Name = ruleName,
                    Definition = jsonRuleDefinition,
                    Description = ruleDescription,
                    RuleFields = ruleFieldSet.Id
                });
            }
        }

        
    }
}
