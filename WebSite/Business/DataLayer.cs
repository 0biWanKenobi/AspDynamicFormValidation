using System;
using System.Collections.Generic;
using System.Configuration;
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
                       //   Id = c.RuleId
                       // , Definition = TranscodeRule(c.RuleDefinition, c.TcrsField1Used, c.TcrsField2Used, c.TcrsField3Used, c.TcrsField4Used, c.TcrsField5Used)
                       // , FieldGroups = GenerateFieldList(c.TcrsField1Used, c.TcrsField2Used, c.TcrsField3Used, c.TcrsField4Used, c.TcrsField5Used)
                       // , Formula = c.ConfigFormulaDefinition
                    }
                ).ToList();

            }
        }

        public static void SaveValidationConfig(int flowId, DtoModels.Formula formula, IEnumerable<DtoModels.Rule> rules){
            using (var dataContext = new ConfigurationContext(ConnectionString))
            {
                var dbFormula = new DaoModels.Formula
                {
                    Name = formula.Name,
                    Description = formula.Description,
                    Tipology = flowId
                };

                dataContext.Formulas.InsertOnSubmit(dbFormula);

                int? prevRuleId = null;

                foreach (var rule in rules)
                {
                    prevRuleId = SaveRuleConfiguration(dataContext, rule, dbFormula.Id, prevRuleId);
                }
            }
        }

        public static void UpdateValidationConfig(int formulaId, IEnumerable<DtoModels.Rule> rules)
        {
            using (var dataContext = new ConfigurationContext(ConnectionString))
            {
                int? prevRuleId = null;
                foreach (var rule in rules)
                {
                    var dbRule = dataContext.Rules
                            .FirstOrDefault(r => 
                                r.Formula == formulaId && r.Name == rule.Name
                            );

                    if (dbRule == null)
                    {
                        prevRuleId = SaveRuleConfiguration(dataContext, rule, formulaId, prevRuleId);
                        int? prevFieldGroupId = null;
                        foreach(var fieldGroup in rule.RuleFieldDefinitions)
                        {
                            prevFieldGroupId = SaveFieldGroupConfiguration(dataContext, prevRuleId.Value, fieldGroup, prevFieldGroupId);
                        }
                    }
                    else
                        UpdateRuleConfiguration(dataContext, rule, formulaId, prevRuleId);
                }
            }
        }


    }
}
