using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Runtime.InteropServices.ComTypes;
using System.Xml.Linq;
using Microsoft.Ajax.Utilities;
using WebGrease.Css.Extensions;
using DtoModels = WebSite.Models.DTO;
using DaoModels = WebSite.Models.DAO;

namespace WebSite.Business
{
    public partial class DataLayer
    {
        private static readonly string ConnectionString = ConfigurationManager.ConnectionStrings["localDB"].ConnectionString;
        public static XDocument LoadValidationConfig(int flowId)
        {
            var xDocument = new XDocument();
            xDocument.Add(new XElement("Formulas"));
            using(var dataContext = new ConfigurationContext(ConnectionString))
            {
                
                dataContext.TipologiesFormulas
                    .Where(tipologyFormula => 
                        tipologyFormula.TipologyId == flowId)
                    .Join(dataContext.Configurations,
                        result => result.FormulaId,
                        configuration => configuration.IdFormula,
                        (result, configuration) => new {configuration.FormulaDefinition}
                    )
                    .ToList()
                    .ForEach(
                        configuration =>
                        {
                            xDocument.Element("Formulas")?.Add(configuration.FormulaDefinition);
                        }
                    );
            }

            return xDocument;
        }

        public static XDocument LoadValidationConfig(string macroType, string typeOne, string typeTwo)
        {
            var xDocument = new XDocument();
            xDocument.Add(new XElement("Configuration"));
            using (var dataContext = new ConfigurationContext(ConnectionString))
            {


               
                try
                {

                    var queryResult = dataContext.Tipologies
                        .Where(tipology =>
                            tipology.MacroType == macroType ||
                            tipology.TypeOne == (typeOne ?? tipology.TypeOne) ||
                            tipology.TypeTwo == (typeTwo ?? tipology.TypeTwo))
                        .Join(dataContext.TipologiesFormulas,
                            tipology => tipology.Id,
                            tipologyFormula => tipologyFormula.TipologyId,
                            (tipology, tipologyFormula) => new {tipologyFormula.FormulaId}
                        )
                        .Join(dataContext.Configurations,
                            result => result.FormulaId,
                            configuration => configuration.IdFormula,
                            (result, configuration) => new {configuration.Tipologie, configuration.FormulaDefinition}
                        )
                        .FirstOrDefault();

                    xDocument.Element("Configuration")?.Add(queryResult?.Tipologie);
                    xDocument.Element("Configuration")?.Add(queryResult?.FormulaDefinition);

                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }

                

              

              //var result =  from configuration in dataContext.Configurations
              //      join tipology in dataContext.Tipologies
              //          on  int.Parse(configuration.Tipologie.Attribute("Id").Value) equals
              //          tipology.Id
              //        where tipology.MacroType == macroType 
              //              && tipology.TypeOne == typeOne 
              //              && tipology.TypeTwo == typeTwo
              //      select new {configuration.FormulaDefinition};

                
            }
            return xDocument;
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

        public static void UpdateValidationConfig(int formulaId, IEnumerable<DtoModels.Rule> rules, IEnumerable<DtoModels.Tipology> tipologies)
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


        public static IEnumerable<DaoModels.Tipology> LoadFlowList()
        {
            using (var dataContext = new ConfigurationContext(ConnectionString))
            {
                

                return dataContext.Tipologies.ToList();
            }
        }
    }
}
