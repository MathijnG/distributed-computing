using DcApi.Logic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;

namespace DcApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CodeController : ControllerBase
    {
        [HttpPost("push")]
        public async Task<string> PushCode([FromForm] string PythonCode, string Title)
        {
            try
            {
                string ReturnValue = "";
                await System.IO.File.WriteAllTextAsync(Path.GetTempPath() + $"{Title}.py", PythonCode);
                ProcessStartInfo start = new ProcessStartInfo();
                start.FileName = "/home/hadoop/spark/bin/spark-submit";
                start.Arguments = string.Format("{0} {1}", " --deploy-mode client " + Path.GetTempPath() + "pythonscript.py", "");
                start.UseShellExecute = false;
                start.RedirectStandardOutput = true;
                using (Process process = Process.Start(start))
                {
                    using (StreamReader reader = process.StandardOutput)
                    {
                        ReturnValue += reader.ReadToEnd();
                    }
                }
                return ReturnValue;
            }
            catch (Exception e)
            {
                return e.Message;
                throw;
            }
            
        }
    }
}
