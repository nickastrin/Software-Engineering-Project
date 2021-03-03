const https = require('https');
const fs = require('fs');

function sessionsPerProvider (providerid, from, to, format) {
    const url = '/evcharge/api/SessionsPerProvider/' + providerid + '/' + from + '/' + to + '?format=' + format;
    const path = "./softeng20bAPI.token";
    
    if(!fs.existsSync(path)) {
        console.log('User authentication required. Please sign in');
        process.exit();
    }

    const options = {
        hostname: 'localhost',
        port: 8765,
        path: url,
        method: 'GET',
        rejectUnauthorized: false,

        headers: {
            'X-OBSERVATORY-AUTH': token
        }
    }

    const req = https.request(options, res => {
        //console.log(`statusCode: ${res.statusCode}`)
    
        res.on('data', d=> {
            if(res.statusCode == 200) {
                console.log(d);
            }
            else if(res.statusCode == 401) {
                console.log('User authentication failed.');
                if(fs.existsSync(path)) {
                    fs.unlink(path);
                    console.log('You have been logged out. Please log in again');
                }
            }
            else if(res.statusCode == 402) {
                console.log('The results came up empty. Please try another request');
            }
            else {
                console.log('Status code: ' + res.statusCode);
                console.log('Details: ' + d);
            }
        })
    })
    req.on('error', error => {
        console.log(error);
        console.log("Something went wrong!");
    })

    req.end();
}

exports.sessionsPerProvider = sessionsPerProvider;