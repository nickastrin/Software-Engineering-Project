const https= require('https');
const fs = require('fs');

const path = "./softeng20bAPI.token";

function logout () {
    if (fs.existsSync(path)) {

        const raw = fs.readFileSync(path);
        const token = JSON.parse(raw).token;

        const options = {
            hostname: 'localhost',
            port: 8765,
            path: '/evcharge/api/logout',
            method: 'POST',
            rejectUnauthorized: false,
        
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-OBSERVATORY-AUTH': token
            }
        }

        const req = https.request(options, res => {
            //console.log(`statusCode: ${res.statusCode}`)
            
        
            res.on('data', d=> {
                if (res.statusCode == 403) {
                    fs.unlink(path, () => {
                        console.log("Session has already expired");
                    });
                }
                else if (res.statusCode == 200) {
                    fs.unlink(path, () => {
                        console.log("You are no longer logged in.");
                    });
                }
                else {
                    console.log("Something went wrong! Status code: ", res.statusCode);
                    console.log(d);
                }
            })
        })
        req.on('error', error => {
            console.log(error);
            console.log("Something went wrong!");
        })

        req.end();
        
    }
    else {
        console.log("You are not currently logged in.");
    }
}

exports.logout = logout;