using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Transactions;
using System.Xml.Linq;
using CCONTACT.Models.DAO;
using Microsoft.Ajax.Utilities;
using Formula = CCONTACT.Models.DTO.Formula;
using Rule = CCONTACT.Models.DTO.Rule;
using Tipology = CCONTACT.Models.DTO.Tipology;

namespace CCONTACT.Business
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
                            tipology.MacroType == macroType &&
                            tipology.TypeOne == (typeOne ?? tipology.TypeOne) &&
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
            }
            return xDocument;
        }

        public static void SaveValidationConfig(int flowId, Formula formula, IEnumerable<Rule> rules, IEnumerable<Tipology> tipologies){
            using (var dataContext = new ConfigurationContext(ConnectionString))
            {
                var dbFormula = new Models.DAO.Formula
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

                foreach (var tipology in tipologies)
                {
                    CreateTipologyValidation(dataContext, tipology, dbFormula.Id);
                }
            }
        }

        public static void UpdateValidationConfig(int formulaId, IEnumerable<Rule> rules, IEnumerable<Tipology> tipologies, IEnumerable<int> removedTipologies, IEnumerable<int> removedRules)
        {
            using (var dataContext = new ConfigurationContext(ConnectionString))
            using (var transactionScope = new TransactionScope())
            {
                int? prevRuleId = null;
                foreach (var rule in rules)
                {
                    

                    if (rule.Id == null)
                    {
                        prevRuleId = SaveRuleConfiguration(dataContext, rule, formulaId, prevRuleId);
                        int? prevFieldGroupId = null;
                        foreach(var fieldGroup in rule.RuleFieldDefinitions)
                        {
                            prevFieldGroupId = SaveFieldGroupConfiguration(dataContext, prevRuleId.Value, fieldGroup, prevFieldGroupId);
                        }
                    }
                    else
                    {
                        UpdateRuleConfiguration(dataContext, rule, formulaId, prevRuleId);
                        prevRuleId = prevRuleId ?? rule.Id;
                        //TO-DO: update fieldgroups configuration
                        int? prevFieldGroupId = null;
                        foreach (var fieldGroup in rule.RuleFieldDefinitions)
                        {
                            if (fieldGroup.Id.HasValue)
                            {
                                fieldGroup.PrevFieldGroupId = prevFieldGroupId;
                                UpdateFieldGroupConfiguration(dataContext, fieldGroup);
                                UpdateFieldGroupFieldsConfiguration(dataContext, fieldGroup.Id.Value, fieldGroup.Field1,
                                    fieldGroup.Field2, fieldGroup.Field3, fieldGroup.Field4, fieldGroup.Field5);
                                prevFieldGroupId = fieldGroup.Id;
                            }
                            else
                            {
                                prevFieldGroupId = SaveFieldGroupConfiguration(dataContext, prevRuleId.Value, fieldGroup, prevFieldGroupId);
                            }
                            DeleteRemovedFields(dataContext, fieldGroup.RemovedFieldIds);
                        }

                        foreach (var fieldGroupId in rule.RemovedFieldGroupIds)
                        {
                            RemoveFieldGroupFields(dataContext, fieldGroupId);
                            RemoveFieldGroup(dataContext, fieldGroupId);
                        }
                       
                    }
                }

                // remove all current associations
                DeleteTipologyValidation(dataContext, formulaId);
                // ReSharper disable once PossibleMultipleEnumeration
                foreach (var tipology in tipologies)
                {
                    UpdateTipologyConfiguration(dataContext, tipology, formulaId);
                    // find elements To Be Created
                    InsertTipologyValidation(dataContext, tipology, formulaId);
                }

                // ReSharper disable once PossibleMultipleEnumeration
                DeleteRemovedTipologies(dataContext, removedTipologies, formulaId);

                DeleteRemovedRules(dataContext, removedRules);
                
                transactionScope.Complete();
            }
        }

        private static void DeleteRemovedRules(ConfigurationContext dataContext, IEnumerable<int> removedRuleIds)
        {
            var removedRules = dataContext.Rules.Where(r => removedRuleIds.Contains(r.Id));
            
            foreach (var removedRule in removedRules)
            {
                var removedFieldGroupIds = dataContext.FieldGroups.Where(fg => fg.RuleId == removedRule.Id).Select(fg => fg.Id);
                foreach (var fieldGroupId in removedFieldGroupIds)
                {
                    RemoveFieldGroupFields(dataContext, fieldGroupId);
                    RemoveFieldGroup(dataContext, fieldGroupId);
                }
            }
            dataContext.Rules.DeleteAllOnSubmit(removedRules);
            dataContext.SubmitChanges();
        }

        private static void DeleteRemovedFields(ConfigurationContext dataContext, List<int> fieldGroupRemovedFieldIds)
        {
            var deletedFields = dataContext.FieldGroupFields.Where(f => fieldGroupRemovedFieldIds.Contains(f.Id));
            dataContext.FieldGroupFields.DeleteAllOnSubmit(deletedFields);
            dataContext.SubmitChanges();
        }

        private static void RemoveFieldGroupFields(ConfigurationContext dataContext, int fieldGroupId)
        {
            var removedFieldGroupFields = dataContext.FieldGroupFields.Where(fgf => fgf.FieldGroupId == fieldGroupId);
            dataContext.FieldGroupFields.DeleteAllOnSubmit(removedFieldGroupFields);
            dataContext.SubmitChanges();
        }

        private static void RemoveFieldGroup(ConfigurationContext dataContext, int fieldGroupId)
        {
            var removedFieldGroup = dataContext.FieldGroups.First(fg => fg.Id == fieldGroupId);
            dataContext.FieldGroups.DeleteOnSubmit(removedFieldGroup);
            dataContext.SubmitChanges();
        }

        private static void UpdateFieldGroupConfiguration(ConfigurationContext dataContext, Models.DTO.FieldGroup fieldGroup)
        {
            var dbFieldGroup = dataContext.FieldGroups
                .FirstOrDefault(fg => fg.Id == fieldGroup.Id);

            if (dbFieldGroup is null) return;

            dbFieldGroup.Name = fieldGroup.Name;
            dbFieldGroup.Operator = fieldGroup.LogicOperator;
            dbFieldGroup.PrevGroupId = fieldGroup.PrevFieldGroupId;
            dbFieldGroup.PrevGroupOperator = fieldGroup.PrevGroupLogicOperator;
            dataContext.SubmitChanges();
        }

        private static void UpdateFieldGroupFieldsConfiguration(ConfigurationContext dataContext, int fieldGroupId,
            params int?[] fieldList)
        {
            var currentFields = dataContext.FieldGroupFields.Where(fgf =>
                fgf.FieldGroupId == fieldGroupId);
            dataContext.FieldGroupFields.DeleteAllOnSubmit(currentFields);
            SaveFieldGroupFieldsConfiguration(dataContext, fieldGroupId, fieldList);
        }


        private static void DeleteRemovedTipologies(ConfigurationContext dataContext, IEnumerable<int> deletedTipologyIds, int formulaId)
        {
            // find elements To Be Deleted
            var tbd = dataContext.ConfTipologiesFormulas
                .Where( ctf =>
                    ctf.FormulaId == formulaId
                    && deletedTipologyIds.Contains(ctf.TipologyId)
                )
                .Join(
                    dataContext.ConfTipologies,
                    ctf => ctf.TipologyId,
                    ct => ct.Id,
                    (ctf, ct) => new {ctf, ct}
                )
                .ToList();

            // ReSharper disable PossibleMultipleEnumeration
            dataContext.ConfTipologiesFormulas.DeleteAllOnSubmit(tbd.Select(join => join.ctf));
            dataContext.SubmitChanges();
            dataContext.ConfTipologies.DeleteAllOnSubmit(tbd.Select(join => join.ct));
            // ReSharper enable PossibleMultipleEnumeration
            dataContext.SubmitChanges();
        }



        private static void DeleteTipologyValidation(ConfigurationContext dataContext, int formulaId)
        {
            var tbd = dataContext.TipologiesFormulas
                .Where(tf => tf.FormulaId == formulaId);

            dataContext.TipologiesFormulas.DeleteAllOnSubmit(tbd);
            dataContext.SubmitChanges();
        }


        private static void CreateTipologyValidation(ConfigurationContext dataContext, Tipology tipology, int formulaId)
        {
            InsertTipologyValidation(dataContext, tipology, formulaId);
            dataContext.SubmitChanges();
        }

        private static void InsertTipologyValidation(ConfigurationContext dataContext, Tipology tipology, int formulaId)
        {
            var tbc = dataContext.Tipologies
                .Where(t => t.MacroType == tipology.MacroType
                            && (t.TypeOne == tipology.TypeOne || tipology.TypeOne == null)
                            && (t.TypeTwo == tipology.TypeTwo || tipology.TypeTwo == null)
                )
                .ToList()
                .Select(t => 
                    new TipologyFormula{ FormulaId = formulaId , TipologyId  = t.Id}
                );

            dataContext.TipologiesFormulas.InsertAllOnSubmit(tbc);
            dataContext.SubmitChanges();
        }

        


        private static void UpdateTipologyConfiguration(ConfigurationContext dataContext, Tipology tipology, int formulaId)
        {

            if(tipology.Id != null)
            {
                var dbTipology = dataContext.ConfTipologies.FirstOrDefault(t =>
                    t.Id == tipology.Id);
                // ReSharper disable once PossibleNullReferenceException
                dbTipology.MacroType = tipology.MacroType;
                dbTipology.TypeOne = tipology.TypeOne;
                dbTipology.TypeTwo = tipology.TypeTwo;
                dataContext.SubmitChanges();
            }
            
            else
            {
                var dbTipology = tipology.MaptoDbConfTipology();
                dataContext.ConfTipologies.InsertOnSubmit(dbTipology);
                dataContext.SubmitChanges();
                dataContext.ConfTipologiesFormulas.InsertOnSubmit(new ConfTipologyFormula
                {
                    FormulaId = formulaId,
                    TipologyId = dbTipology.Id
                });
                dataContext.SubmitChanges();
            }
        }


        public static IEnumerable<object> LoadMacrotypes()
        {
            using (var dataContext = new ConfigurationContext(ConnectionString))
            {


                return dataContext.Tipologies
                    .DistinctBy(t => t.MacroType)
                    .Select(t => new{ value = t.MacroType } )
                    .ToList();
            }
        }

        public static IEnumerable<object> LoadTipologies(string macrotype)
        {
            if (macrotype.IsNullOrWhiteSpace())
                return new List<string>();
            using (var dataContext = new ConfigurationContext(ConnectionString))
            {


                return dataContext.Tipologies
                    .DistinctBy(t => t.TypeOne)
                    .Where(t => t.MacroType == macrotype)
                    .Select( t => new {value = t.TypeOne})
                    .ToList();
            }
        }

        public static IEnumerable<object> LoadSubtypes(string macrotype, string tipologyName)
        {

            if(macrotype.IsNullOrWhiteSpace() || tipologyName.IsNullOrWhiteSpace())
                return new List<string>();
            using (var dataContext = new ConfigurationContext(ConnectionString))
            {
                return dataContext.Tipologies
                    .DistinctBy(t => t.TypeTwo)
                    .Where(t => 
                        t.MacroType == macrotype
                        && t.TypeOne == tipologyName
                        )
                    .Select(t => new{ value = t.TypeTwo})
                    .ToList();
            }
        }


        public static IEnumerable<Models.DAO.Tipology> LoadFlowList()
        {
            using (var dataContext = new ConfigurationContext(ConnectionString))
            {
                

                return dataContext.Tipologies.ToList();
            }
        }
    }
}
