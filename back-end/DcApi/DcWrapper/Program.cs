using Microsoft.Spark;
using Microsoft.Spark.Sql;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;

namespace DcWrapper
{
    class Program
    {
        static void Main(string[] args)
        { 
            var spark = SparkSession
              .Builder()
              .AppName("wrapper_application")
              .Master("spark://localhost:7077")
              .GetOrCreate();

            ProcessStartInfo start = new ProcessStartInfo();
            start.FileName = "/bin/python3";
            start.Arguments = string.Format("{0} {1}", args[1], args.Skip(2).ToArray());
            start.UseShellExecute = false;
            start.RedirectStandardOutput = true;
            using (Process process = Process.Start(start))
            {
                using (StreamReader reader = process.StandardOutput)
                {
                    Console.WriteLine(reader.ReadToEnd());
                }
            }
        }
    }
}
