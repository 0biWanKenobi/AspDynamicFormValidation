using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSite.Models
{
    public class Rule
    {
        public int Id { get; set; }
        public string Definition { get; set; }

        public string RuleFields { get; set; }
        public string Formula { get; set; }
    }
}
