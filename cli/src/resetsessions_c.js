const https= require('https');

function resetsessions () {
    path = './softeng20bAPI.token';

    const options = {
        hostname: 'localhost',
        port: 8765,
        path: '/evcharge/api/resetsessions',
        method: 'POST',
        rejectUnauthorized: false
    }

    const req = https.request(options, res => {
        //console.log(`statusCode: ${res.statusCode}`)
    
        res.on('data', d=> {
            if(d.status == 'OK') {
                console.log('Successfully reset event sessions and admin account');
            }
            else if (d.status = 'failed') {
                console.log('Resetting failed. Please try again');
            }
            else {
                console.log('Something went wrong: ' + d);
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