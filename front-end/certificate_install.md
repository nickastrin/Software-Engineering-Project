Installation Guide for Self Signed Certificate in Windows 10

    -Installing the certificate.
        1. In Windows search: "Manage Computer Certificates" and open it.
        2. Expand "Trusted Root Ceritification Authorities".
        3. Right click on "Certificates" and select "All Tasks" -> "Import".
        4. Enter the path for the certificate.crt file and import the certificate.

    -Enviromental Variables.
        1. Open cmd.exe (not working from Visual Studio Code or other editor terminal). 
        2. Change path to ./front-end where files certificate.crt 
        and certificate.key should be.
        Run commands:
        3. set HTTPS=true
        4. set SSL_KEY_FILE=certificate.key
        5. set SSL_CRT_FILE=certificate.crt

    -Run Frontend Development Build in cmd.exe at ./front-end path.
    