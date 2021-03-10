const https = require('https');
const fs = require('fs');

function users (username) {
    const url = '/evcharge/api/admin/users/' + username;
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

exports.usermod = usermod;