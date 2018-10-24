using System.Linq;
using CCONTACT.Models.DAO;
using FieldGroup = CCONTACT.Models.DTO.FieldGroup;
using Rule = CCONTACT.Models.DTO.Rule;

namespace CCONTACT.Business
{
    public static partial class DataLayer
    {
       
        private static int SaveRuleConfiguration(ConfigurationContext dataContext, Rule rule, int formulaId, int? prevRule)
        {
            var dbRule = rule.MaptoDbRule(formulaId, prevRule);

            dataContext.Rules.InsertOnSubmit(dbRule);
            dataContext.SubmitChanges();
            return dbRule.Id;
        }

        private static void UpdateRuleConfiguration(ConfigurationContext dataContext, Rule rule, int formulaId, int? prevRule)
        {
            var currentRule = dataContext.Rules.FirstOrDefault(dbRule =>
                dbRule.Id == rule.Id
            );

            if (currentRule == null) return;

            currentRule.Description = rule.Description;
            currentRule.PrevRule = prevRule;
            dataContext.SubmitChanges();
        }

        private static int SaveFieldGroupConfiguration(ConfigurationContext dataContext, int ruleId, FieldGroup fieldGroup, int? prevGroup)
        {
            var dbFieldGroup =  fieldGroup.MaptoDbFieldGroup(prevGroup, ruleId);
            dataContext.FieldGroups.InsertOnSubmit(dbFieldGroup);
            dataContext.SubmitChanges();
            SaveFieldGroupFieldsConfiguration(dataContext, dbFieldGroup.Id, fieldGroup.Field1, fieldGroup.Field2, fieldGroup.Field3, fieldGroup.Field4, fieldGroup.Field5);
            return dbFieldGroup.Id;
        }

        private static void SaveFieldGroupFieldsConfiguration(ConfigurationContext dataContext, int fieldGroupId, params int?[] fieldList)
        {
            foreach (var field in fieldList.Where(f => f.HasValue))
            {
                dataContext.FieldGroupFields.InsertOnSubmit(new FieldGroupField
                {
                    FieldGroupId = fieldGroupId,
                    FieldId = field.Value
                });
            }
            dataContext.SubmitChanges();
        }

        private static Models.DAO.FieldGroup MaptoDbFieldGroup(this FieldGroup fieldGroup, int? prevGroup, int ruleId)
        {
            return new Models.DAO.FieldGroup
            {
                Name = fieldGroup.Name,
                Operator = fieldGroup.LogicOperator,
                PrevGroupId = prevGroup,
                PrevGroupOperator = fieldGroup.PrevGroupLogicOperator,
                RuleId = ruleId
            };
        }

        private static Models.DAO.Rule MaptoDbRule(this Rule rule, int formulaId, int? prevRule)
        {
            return new Models.DAO.Rule()
            {
                Name = rule.Name,
                Description = rule.Description,
                Formula = formulaId,
                PrevRule = prevRule
            };
        }

        private static ConfTipology MaptoDbConfTipology(this Models.DTO.Tipology t)
        {
            return new Models.DAO.ConfTipology
            {
                MacroType = t.MacroType,
                TypeOne = t.TypeOne,
                TypeTwo = t.TypeTwo
            };
        }
    }
}
