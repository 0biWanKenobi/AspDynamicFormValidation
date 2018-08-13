﻿using System.Data;
using System.Data.Linq;
using System.Data.Linq.Mapping;
using WebSite.Models;
using Rule = WebSite.Models.DAO.Rule;

namespace WebSite.Business
{
    public class ConfigurationContext : DataContext
    {

        public Table<Configuration> Configurations;
        public Table<Rule> Rules;

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
