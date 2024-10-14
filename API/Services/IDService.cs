using System;
using System.Text;
using pt.portugal.eid;
using API.Intefaces;


public class IDService : IIDService
{
   
    private PTEID_ReaderContext readerContext;
    private PTEID_EIDCard card;
    private const string CertPath = @"C:\Program Files\Portugal Identity Card\eidstore\certs";

    public IDService()
    {
        // Set the certificate store path
        // PTEID_Config.SetCertDir(CertPath);
        PTEID_Config.SetTestMode(true);
        // this.readerContext = null;
        // this.card = null;
        
    }

    public void Start()
    {
        try
        {
            Initialize();
            ReadCard();
        }
        catch (PTEID_ExNoReader)
        {
            Console.WriteLine("No reader found.");
        }
        catch (PTEID_ExNoCardPresent)
        {
            Console.WriteLine("No card inserted.");
        }
        catch (PTEID_Exception ex)
        {
            Console.WriteLine(ex.GetMessage());
        }
        finally
        {
            Release();
            Console.ReadLine();
        }
    }


    public bool Initialize()
    {
        try
        {
            PTEID_ReaderSet.initSDK();
            readerContext = PTEID_ReaderSet.instance().getReader();
            return true;
        }
        catch (PTEID_Exception ex)
        {
            Console.WriteLine($"Failed to initialize SDK: {ex.Message}");
            return false;
        }
    }

    public bool ReadCard()
    {
        try
        {
            if (!readerContext.isCardPresent())
                return false;


            var contactInterface = readerContext.getCardContactInterface();
            var cardType = readerContext.getCardType();
            Console.WriteLine("Contact Interface:" + (contactInterface == PTEID_CardContactInterface.PTEID_CARD_CONTACTLESS ? "CONTACTLESS" : "CONTACT"));
            card = readerContext.getEIDCard();
            //If the contactInterface is contactless and the card supports contactless then authenticate with PACE
            if (contactInterface == PTEID_CardContactInterface.PTEID_CARD_CONTACTLESS && cardType == PTEID_CardType.PTEID_CARDTYPE_IAS5)
            {
                Console.WriteLine("Insert the Card access number (CAN) for the card in use: ");
                string can_str = Console.ReadLine();
                uint can_size = (uint)can_str.Length;
                card.initPaceAuthentication(can_str, can_size, PTEID_CardPaceSecretType.PTEID_CARD_SECRET_CAN);
            }

            PTEID_EId eid = card.getID();

            GetPersonalInformation(eid);


            //CARD ADDRESS: VERY IMPORTANT Desde a versão 3.9.0 do Middleware a morada do CC é lida a partir dos serviços centrais o que implica ligação à Internet funcional para a utilização da classe PTEID_Address para além da presença do cartão no leitor. É por isso necessário garantir que não existe firewall ou outro software na rede local que impeça a ligação ao endereço morada.cartaodecidadao.pt no porto 443

            ShowAddressInfo();


            ////CARD NOTES: Writting on the card
            ////Ler notas atuais e imprimir na consola
            //String my_notes = eidCard.readPersonalNotes();
            //Console.WriteLine("Current notes: " + my_notes);

            ////Escrever novas notas
            //String notes = "We wrote successfully to the card!";

            //byte[] notesBytes = Encoding.UTF8.GetBytes(notes);
            //PTEID_ByteArray personalNotes = new PTEID_ByteArray(notesBytes, (uint)notesBytes.Length);
            //Boolean ok;

            //PTEID_Pins pins = eidCard.getPins();
            //PTEID_Pin pin = pins.getPinByPinRef(PTEID_Pin.AUTH_PIN); // AUTH_PIN - Código de Autenticação

            //ok = eidCard.writePersonalNotes(personalNotes, pin);
            //Console.WriteLine("Was writing successful? " + (ok ? "Yes!" : "No."));

            return true;
        }
        catch (PTEID_Exception ex)
        {
            Console.WriteLine($"Failed to read card: {ex.Message}");
            return false;
        }
    }

    public void GetPersonalInformation(PTEID_EId eid)
    {
        // Personal Information
        string firstName = eid.getGivenName();
        string lastName = eid.getSurname();
        string documentNumber = eid.getDocumentNumber();
        string gender = eid.getGender();
        DateTime birthDate = DateTime.Parse(eid.getDateOfBirth());
        string nationality = eid.getNationality();
        string documentVersion = eid.getDocumentVersion();
        string documentType = eid.getDocumentType();
        string country = eid.getCountry();
        string civilIdNumber = eid.getCivilianIdNumber();
        string taxNumber = eid.getTaxNo();
        string socialSecurityNumber = eid.getSocialSecurityNumber();
        string healthNumber = eid.getHealthNumber();
        string issuingEntity = eid.getIssuingEntity();
        string localOfRequest = eid.getLocalofRequest();
        string validityBeginDate = eid.getValidityBeginDate();
        string validityEndDate = eid.getValidityEndDate();
        string height = eid.getHeight();
        string fatherFirstName = eid.getGivenNameFather();
        string fatherLastName = eid.getSurnameFather();
        string motherFirstName = eid.getGivenNameMother();
        string motherLastName = eid.getSurnameMother();
        string parents = eid.getParents();

        //photo
        PTEID_Photo photoObj = eid.getPhotoObj();
        PTEID_ByteArray praw = photoObj.getphotoRAW();  // formato JPEG2000
        PTEID_ByteArray ppng = photoObj.getphoto();     // formato PNG
    }

    public void ShowAddressInfo()
    {
        var eidCard = readerContext.getEIDCard();
        PTEID_EId eid = eidCard.getID();
        //The number of tries that the user has (updated with each call to verifyPin)
        uint triesLeft = uint.MaxValue;

        //Get the collection of card PINs
        PTEID_Pins pins = eidCard.getPins();

        //Get the specific PIN we want
        PTEID_Pin pin = pins.getPinByPinRef(PTEID_Pin.ADDR_PIN);

        //If the method verifyPin is called with "" as the first argument it prompts the middleware GUI for the user to insert its PIN
        //Otherwise we can provide the PIN as the first argument and the end result will be the same
        if (pin.verifyPin("", ref triesLeft, true))
        {

            //SDK class that handles address related information
            PTEID_Address address = eidCard.getAddr();
            Console.WriteLine("\n\nReading address details of: " + eid.getGivenName() + " " + eid.getSurname() + ":");

            if (address.isNationalAddress())
            {
                Console.WriteLine("---National Address---");
                Console.WriteLine("District:                       " + address.getDistrict());
                Console.WriteLine("District (code):                " + address.getDistrictCode());
                Console.WriteLine("Municipality:                   " + address.getMunicipality());
                Console.WriteLine("Municipality (code):            " + address.getMunicipalityCode());
                Console.WriteLine("Parish:                         " + address.getCivilParish());
                Console.WriteLine("Parish (code):                  " + address.getCivilParishCode());
                Console.WriteLine("Street Type (Abbreviated):      " + address.getAbbrStreetType());
                Console.WriteLine("Street Type:                    " + address.getStreetType());
                Console.WriteLine("Street Name:                    " + address.getStreetName());
                Console.WriteLine("Building Type (Abbreviated):    " + address.getAbbrBuildingType());
                Console.WriteLine("Building Type:                  " + address.getBuildingType());
                Console.WriteLine("Door nº:                        " + address.getDoorNo());
                Console.WriteLine("Floor:                          " + address.getFloor());
                Console.WriteLine("Side:                           " + address.getSide());
                Console.WriteLine("Locality:                       " + address.getLocality());
                Console.WriteLine("Place:                          " + address.getPlace());
                Console.WriteLine("Postal code:                    " + address.getZip4() + "-" + address.getZip3());
                Console.WriteLine("Postal Locality:                " + address.getPostalLocality());
            }
            else
            {
                Console.WriteLine("---Foreign Address---");
                Console.WriteLine("Address:     " + address.getForeignAddress());
                Console.WriteLine("City:        " + address.getForeignCity());
                Console.WriteLine("Locality:    " + address.getForeignLocality());
                Console.WriteLine("Postal Code: " + address.getForeignPostalCode());
                Console.WriteLine("Region:      " + address.getForeignRegion());
                Console.WriteLine("Country:     " + address.getForeignCountry());
            }
        }
    }

    public bool VerifyCertificate()
    {
        try
        {
            PTEID_Certificate cert = card.getAuthentication();
            // Implement certificate verification logic here
            // For example:
            // bool isValid = cert.Validate();
            // return isValid;
            return true; // Placeholder
        }
        catch (PTEID_Exception ex)
        {
            Console.WriteLine($"Failed to verify certificate: {ex.Message}");
            return false;
        }
    }

    public bool AuthenticateUser()
    {
        try
        {
            // This is a placeholder for the actual authentication logic
            // You might need to prompt for a PIN and verify it with the card
            // For example:
            // string pin = PromptUserForPin();
            // bool isAuthenticated = card.VerifyAuthPin(pin);
            // return isAuthenticated;
            return true; // Placeholder
        }
        catch (PTEID_Exception ex)
        {
            Console.WriteLine($"Failed to authenticate user: {ex.Message}");
            return false;
        }
    }

    // Sign PDF file. Returns true if the operation was successful, false otherwise. 
    public bool Sign(string inputFilePath = "C:\\test.pdf", string outputFilePath = "")
    {
        var eidCard = readerContext.getEIDCard();
        // Necessário para chamadas com PTEID_CMDSignatureClient
        // PTEID_CMDSignatureClient.setCredentials(BASIC_AUTH_USER, BASIC_AUTH_PASSWORD, BASIC_AUTH_APPID);
        // Neste exemplo ambas as opções estão ativas e, por isso, será apresentada uma janela
        PTEID_SigningDeviceFactory factory = PTEID_SigningDeviceFactory.instance();
        PTEID_SigningDevice signingDev = factory.getSigningDevice(true, true);



        //Ficheiro PDF a assinar
        PTEID_PDFSignature sig = new PTEID_PDFSignature(inputFilePath);

        /* Adicionar uma imagem customizada à assinatura visível
           O array de bytes image_data deve conter uma imagem em formato
           JPEG com as dimensões obrigatórias: (351x77 px) */
        // PTEID_ByteArray data = jpeg_data(image_data, image_length);
        // sig.setCustomImage(data);

        // No caso de se querer o formato pequeno da assinatura
        sig.enableSmallSignatureFormat();

        /* Configurar o perfil da assinatura:
        PAdES-B: PTEID_SignatureLevel::PTEID_LEVEL_BASIC (configurado por defeito)
        PAdES-T: PTEID_SignatureLevel::PTEID_LEVEL_TIMESTAMP
        PAdES-LT: PTEID_SignatureLevel::PTEID_LEVEL_LT
        PAdES-LTA: PTEID_SignatureLevel::PTEID_LEVEL_LTV */
        sig.setSignatureLevel(PTEID_SignatureLevel.PTEID_LEVEL_LTV);

        //Especificar local da assinatura e motivo
        const string location = "Lisboa, Portugal";
        const string reason = "Concordo com o conteudo do documento";

        //Especificar o número da página e a posição nessa mesma página onde a indicação visual da assinatura aparece
        int page = 1;
        double pos_x = 0.1; //Valores de 0 a 1
        double pos_y = 0.1; //Valores de 0 a 1

        //// setting custom seal size
        //signature.setCustomSealSize(200, 200);

        try
        {
            eidCard.SignPDF(sig, page, pos_x, pos_y, location, reason, String.IsNullOrEmpty(outputFilePath) ? inputFilePath : outputFilePath);
            return true;
           
        }
        // catch (pteidlib_dotNet.EIDMW_TIMESTAMP_ERROR ex)
        // {
        //     Console.WriteLine($"Failed to sign PDF on one or more signatures with type PAdES-T, PAdES-LT or PAdES-LTA. Falling back to default PTEID_LEVEL_BASIC signature. Error details: {ex.Message}");
        //     return false;
        // } 
        // catch (EIDMW_LTV_ERROR ex)
        // {
        //     Console.WriteLine($"Failed to sign PDF on one or more signatures with type PAdES-LT or PAdES-LTA. Falling back to default PAdES-T or PAdES-LT signature. Error details: {ex.Message}");
        //     return false;
        // }
        catch (PTEID_Exception ex)
        {
            Console.WriteLine($"Failed to sign PDF for unknown reason. Error: {ex.Message}");
            return false;
        }
    }

    public bool BatchSign(string[] filesPathList, string outputDirectory)
    {
        PTEID_PDFSignature signature = new PTEID_PDFSignature();
        PTEID_SigningDeviceFactory factory = PTEID_SigningDeviceFactory.instance();
        PTEID_SigningDevice signingDev = factory.getSigningDevice(true, true);


        //Para realizar uma assinatura em batch adicionar todos os ficheiros usando o seguinte método antes de invocar o signingDev.SignPDF()
        foreach (var  file in filesPathList)
        {
            signature.addToBatchSigning(file);
        }

        //Especificar local da assinatura e motivo
        const string location = "Lisboa, Portugal";
        const string reason = "Concordo com o conteudo do documento";

        //Especificar o número da página e a posição nessa mesma página onde a indicação visual da assinatura aparece
        int page = 1;
        double pos_x = 0.1; //Valores de 0 a 1
        double pos_y = 0.1; //Valores de 0 a 1

        //// setting custom seal size
        //signature.setCustomSealSize(200, 200);

        try
        {
            signingDev.SignPDF(signature, page, pos_x, pos_y, location, reason, outputDirectory);
            return true;

        }
        // catch (EIDMW_TIMESTAMP_ERROR ex)
        // {
        //     Console.WriteLine($"Failed to sign PDF on one or more signatures with type PAdES-T, PAdES-LT or PAdES-LTA. Falling back to default PTEID_LEVEL_BASIC signature. Error details: {ex.Message}");
        //     return false;
        // }
        // catch (EIDMW_LTV_ERROR ex)
        // {
        //     Console.WriteLine($"Failed to sign PDF on one or more signatures with type PAdES-LT or PAdES-LTA. Falling back to default PAdES-T or PAdES-LT signature. Error details: {ex.Message}");
        //     return false;
        // }
        catch (PTEID_Exception ex)
        {
            Console.WriteLine($"Failed to sign PDF for unknown reason. Error: {ex.Message}");
            return false;
        }
    }

    public void SignCMD(String input_file, String output_file)
    {

        //To sign a document you must initialize an instance of PTEID_PDFSignature 
        //It may take the path for the input file as argument
        PTEID_PDFSignature signature = new PTEID_PDFSignature(input_file);

        //You can set the location and reason fields of the signature
        String location = "Lisboa, Portugal";
        String reason = "Concordo com o conteudo do documento";

        //The page and coordinates where the signature will be printed
        int page = 1;
        double pos_x = 0.1;
        double pos_y = 0.1;

        //Instead of calling the getEIDCard() method, you can now also initialize an instance of the CMDSignatureClient to sign files with CMD
        PTEID_CMDSignatureClient client = new PTEID_CMDSignatureClient();

        //And you sign the file normally as you would in the previous versions of the SDK 
        client.SignPDF(signature, page, pos_x, pos_y, location, reason, output_file);

        Console.WriteLine("File signed with CMD with success.");
    }

    public void Release()
    {
        try
        {
            PTEID_ReaderSet.releaseSDK();
        }
        catch (PTEID_Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }


}
