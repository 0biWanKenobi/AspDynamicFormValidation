using System.Linq;
using DaoModels = WebSite.Models.DAO;
using DtoModels = WebSite.Models.DTO;
using Rule = WebSite.Models.DTO.Rule;

namespace WebSite.Business
{
    public partial class DataLayer
    {
       
        private static int SaveRuleConfiguration(ConfigurationContext dataContext, Rule rule, int formulaId, int? prevRule)
        {
            var dbRule = MaptoDbRule(rule, formulaId, prevRule);

            dataContext.Rules.InsertOnSubmit(dbRule);
            dataContext.SubmitChanges();
            return dbRule.Id;
        }

        private static void UpdateRuleConfiguration(ConfigurationContext dataContext, Rule rule, int formulaId, int? prevRule)
        {
            var currentRule = dataContext.Rules.FirstOrDefault(dbRule =>
                dbRule.Name == rule.Name && dbRule.Formula == formulaId
            );

            if (currentRule == null) return;

            currentRule.Description = rule.Description;
            currentRule.PrevRule = prevRule;

        }

        private static int SaveFieldGroupConfiguration(ConfigurationContext dataContext, int ruleId, DtoModels.FieldGroup fieldGroup, int? prevGroup)
        {
            var dbFieldGroup = MaptoRuleFields(fieldGroup, prevGroup, ruleId);
            dataContext.FieldGroups.InsertOnSubmit(dbFieldGroup);
            dataContext.SubmitChanges();
            SaveFieldGroupFieldsConfiguration(dataContext, dbFieldGroup.Id, fieldGroup.Field1, fieldGroup.Field2, fieldGroup.Field3, fieldGroup.Field4, fieldGroup.Field5);
            return dbFieldGroup.Id;
        }

        private static void SaveFieldGroupFieldsConfiguration(ConfigurationContext dataContext, int fieldGroupId, params int?[] fieldList)
        {
            foreach (var field in fieldList.Where(f => f.HasValue))
            {
                dataContext.FieldGroupFields.InsertOnSubmit(new DaoModels.FieldGroupField
                {
                    FieldGroupId = fieldGroupId,
                    FieldId = field.Value
                });
            }
            dataContext.SubmitChanges();
        }

        private static DaoModels.FieldGroup MaptoRuleFields(DtoModels.FieldGroup fieldGroup, int? prevGroup, int ruleId)
        {
            return new DaoModels.FieldGroup
            {
                Name = fieldGroup.Name,
                Operator = fieldGroup.LogicOperator,
                PrevGroupId = prevGroup,
                PrevGroupOperator = fieldGroup.PrevGroupLogicOperator,
                RuleId = ruleId

            };
            throw new System.NotImplementedException();
        }

        private static DaoModels.Rule MaptoDbRule(Rule rule, int formulaId, int? prevRule)
        {
            return new DaoModels.Rule()
            {
                Name = rule.Name,
                Description = rule.Description,
                Formula = formulaId,
                PrevRule = prevRule
            };
        }
    }
}
