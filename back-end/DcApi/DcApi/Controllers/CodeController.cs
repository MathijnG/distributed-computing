using DcApi.Logic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DcApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CodeController : ControllerBase
    {
        [HttpPost]
        public string PushCode([FromBody] string PythonCode)
        {
            // write python code to file on master server
            var wrapper = new Wrapper(PythonCode);
            return wrapper.Execute();
        }
    }
}
