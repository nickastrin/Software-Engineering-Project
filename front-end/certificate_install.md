Installation Guide for Self Signed Certificate for Windows 10

    -Install the certificate.
        1. In Windows search: "Manage Computer Certificates" and open it.
        2. Expand "Trusted Root Ceritification Authorities"
        3. Right click on "Certificates" and select "All Tasks" -> "Import".
        4. Enter the path for the certificate.crt file and import the certificate.

    -Enviromental Variables: Go to frontend main directory where files certificate.crt 
     and certificate.key should be and type the commands:
        1. set HTTPS=true
        2. set SSL_KEY_FILE=certificate.key
        3. set SSL_CRT_FILE=certificate.crt

    -Run Frontend Development Build.
    