using DcApi.Logic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using System.Diagnostics;

namespace DcApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CodeController : ControllerBase
    {
        [HttpPost("push")]
        public async Task<string> PushCode([FromForm] string PythonCode, string Title)
        {
            await System.IO.File.WriteAllTextAsync(Path.GetTempPath() + "pythonscript.py", MakeSparkReadable(PythonCode, Title));

            ProcessStartInfo start = new ProcessStartInfo();
            start.FileName = "/opt/spark/bin/spark-submit";
            start.Arguments = string.Format("{0} {1}", " --deploy-mode cluster " + Path.GetTempPath() + "pythonscript.py", "");
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

        private string MakeSparkReadable(string code, string title)
        {
            string sparkReadableCode = "";
            sparkReadableCode += "from pyspark.sql import SparkSession\n";
            sparkReadableCode += "\n";
            sparkReadableCode += "\n";
            sparkReadableCode += $"spark = SparkSession.builder.appName(\"{title}\").getOrCreate()\n\n";
            sparkReadableCode += code;

            return sparkReadableCode;
        }
    }
}
