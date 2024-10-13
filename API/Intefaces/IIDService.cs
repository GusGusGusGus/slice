using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using pt.portugal.eid;

namespace API.Intefaces
{
    public interface IIDService
    {

        public void Start();
        public bool ReadCard();
        public void GetPersonalInformation(PTEID_EId eid);
        public void ShowAddressInfo();
        public bool VerifyCertificate();
        public bool AuthenticateUser();
        public bool Sign(string inputFilePath, string outputFilePath);
        public bool BatchSign(string[] filesPathList, string outputDirectory);
        public void SignCMD(String input_file, String output_file);
        public void Release();

    }
}