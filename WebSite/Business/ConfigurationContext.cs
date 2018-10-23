using System.Data;
using System.Data.Linq;
using System.Data.Linq.Mapping;
using CCONTACT.Models.DAO;
using Rule = CCONTACT.Models.DAO.Rule;

namespace CCONTACT.Business
{
    public class ConfigurationContext : DataContext
    {

        public Table<Configuration> Configurations;
        public Table<Formula> Formulas;
        public Table<Rule> Rules;
        public Table<FieldGroup> FieldGroups;
        public Table<FieldGroupField> FieldGroupFields;
        public Table<Tipology> Tipologies;
        public Table<TipologyFormula> TipologiesFormulas;
        public Table<ConfTipologyFormula> ConfTipologiesFormulas;
        public Table<ConfTipology> ConfTipologies;

        public ConfigurationContext(string fileOrServerOrConnection) : base(fileOrServerOrConnection)
        {
        }

        public ConfigurationContext(string fileOrServerOrConnection, MappingSource mapping) : base(fileOrServerOrConnection, mapping)
        {
        }

        public ConfigurationContext(IDbConnection connection) : base(connection)
        {
        }

        public ConfigurationContext(IDbConnection connection, MappingSource mapping) : base(connection, mapping)
        {
        }

        
    }
}
