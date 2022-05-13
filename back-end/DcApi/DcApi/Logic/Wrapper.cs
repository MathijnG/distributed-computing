using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace DcApi.Logic
{
    public class Wrapper
    {
        private string path;
        public Wrapper(string path)
        {
            this.path = path;
        }

        public string Execute(string args = "")
        {
            ProcessStartInfo start = new ProcessStartInfo();
            start.FileName = "/opt/spark/bin/spark-submit";
            start.Arguments = string.Format("{0} {1}", path, args);
            start.UseShellExecute = false;
            start.RedirectStandardOutput = true;
            using (Process process = Process.Start(start))
            {
                using (StreamReader reader = process.StandardOutput)
                {
                    return reader.ReadToEnd();
                }
            }
        }

    }
}
