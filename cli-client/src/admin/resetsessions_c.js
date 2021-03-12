const https= require('https');

function resetsessions () {
    path = './softeng20bAPI.token';

    const options = {
        hostname: 'localhost',
        port: 8765,
        path: '/evcharge/api/admin/resetsessions',
        method: 'POST',
        rejectUnauthorized: false
    }

    const req = https.request(options, res => {
        //console.log(`statusCode: ${res.statusCode}`)
    
        res.on('data', d=> {
            if(res.statusCode == 200) {
                console.log(JSON.parse(d));
            }
            else {
                console.log('Something went wrong: \n' + JSON.parse(d));
            }
        })
    })
    req.on('error', error => {
        console.log(error);
        console.log("Something went wrong!");
    })

    req.end();
}

exports.resetsessions = resetsessions;