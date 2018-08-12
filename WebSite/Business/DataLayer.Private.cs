using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSite.Business
{
    public partial class DataLayer
    {
        private static string GenerateFieldList(params bool[] l)
        {
            var r = l
                .Select((b, i) =>
                {
                    var s = $"'field{i + 1}'";
                    return new { b, s };
                })
                .Where(rs => rs.b)
                .Select(rs => rs.s);
            var f = string.Join(", ", r);
            return f;

        }

        private static string TranscodeRule(string s, params bool[] l)
        {
            var enumerable = l.ToList();
            for (var i = 1; i < enumerable.Count(); i++)
            {
                if (enumerable.ElementAt(i - 1))
                    s = s.Replace($"field{i}()", $"isFilled('field{i}')");
            }

            return s;
        }
    }
}
