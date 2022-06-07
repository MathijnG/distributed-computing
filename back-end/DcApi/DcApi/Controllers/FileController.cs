using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using System.IO;
using Microsoft.AspNetCore.Http;
using System;
using System.Diagnostics;

namespace DcApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : Controller
    {
        [HttpPost("upload")]
        public async Task<IActionResult> UploadFileAsync(IFormFile file)
        {
            string _fileName = Path.GetFileName(file.FileName);

            if (!string.IsNullOrWhiteSpace(_fileName))
            {
                // Create unique but recognizable file name.
                _fileName = _fileName.Replace(" ", "_");
                string fileExtension = Path.GetExtension(_fileName);
                string fileName = _fileName.TrimEnd(fileExtension.ToCharArray());
                fileName = $"{fileName}_{Guid.NewGuid()}{fileExtension}";

                // Make file spark readable and write to tmp dir.
                await System.IO.File.WriteAllTextAsync(Path.GetTempPath() + fileName, MakeSparkReadable(file));

                // Start python code on hadoop cluster.
                ProcessStartInfo start = new ProcessStartInfo();
                start.FileName = "/home/hadoop/spark/bin/spark-submit";
                start.Arguments = string.Format("{0} {1}", " --deploy-mode cluster " + Path.GetTempPath() + fileName, "");
                start.UseShellExecute = false;
                start.RedirectStandardOutput = true;

                return Ok();
            }
            return BadRequest();
        }

        private string MakeSparkReadable(IFormFile file)
        {
            string code;
            using (StreamReader stream = new StreamReader(file.OpenReadStream()))
            {
                code = stream.ReadToEnd();
            }
            string sparkReadableCode = "";
            sparkReadableCode += "from pyspark.sql import SparkSession\n";
            sparkReadableCode += "\n";
            sparkReadableCode += "\n";
            sparkReadableCode += $"spark = SparkSession.builder.appName(\"{file.FileName}\").getOrCreate()\n\n";
            sparkReadableCode += code;

            return sparkReadableCode;
        }
    }
}
