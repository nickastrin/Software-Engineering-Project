Installation Guide for Self Signed Certificate in Windows 10

    -Installing the certificate.
        1. In Windows search: "Manage Computer Certificates/Διαχείριση Πιστοποιητικών Υπολογιστή" and open it.
           Doesn't work with "Manage User Certificates/Διαχείριση Πιστοποιητικών Χρήστη" !
        2. Expand "Trusted Root Ceritification Authorities/Αξιόπιστες Κεντρικές Αρχές Έκδοσης Πιστοποιητικών".
        3. Right click on "Certificates" and select "All Tasks" -> "Import".
        4. Enter the path for the certificate.crt file and import the certificate.

    -Enviromental Variables.
        1. Open cmd.exe (not working from Visual Studio Code or other editor terminal). 
        2. Change path to ./front-end where certificate.crt and certificate.key files should be.
        Run commands:
            set HTTPS=true
            set SSL_KEY_FILE=certificate.key
            set SSL_CRT_FILE=certificate.crt

    -Run "npm start" in cmd.exe at ./front-end path to start the Frontend Development Build.
    