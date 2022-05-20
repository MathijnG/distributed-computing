using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using System.IO;
using Microsoft.AspNetCore.Http;
using System;

namespace DcApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : Controller
    {
        [HttpPost("upload")]
        public IActionResult UploadFile(IFormFile file)
        {
            string tempPath = Path.GetTempPath();
            string _fileName = Path.GetFileName(file.FileName);

            if (!string.IsNullOrWhiteSpace(_fileName))
            {
                _fileName = _fileName.Replace(" ", "_");
                string fileExtension = Path.GetExtension(_fileName);
                string fileName = _fileName.TrimEnd(fileExtension.ToCharArray());

                fileName = $"{fileName}_{Guid.NewGuid()}{fileExtension}";

                using FileStream stream = new FileStream(Path.Combine(Path.GetTempPath(), fileName), FileMode.Create);
                    file.CopyTo(stream);
                    return Ok();

            }

            return BadRequest();
        }
    }
}
