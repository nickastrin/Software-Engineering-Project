const https= require('https');

function healthcheck () {
    path = './softeng20bAPI.token';

    const options = {
        hostname: 'localhost',
        port: 8765,
        path: '/evcharge/api/healthcheck',
        method: 'GET',
        rejectUnauthorized: false
    }

    const req = https.request(options, res => {
        //console.log(`statusCode: ${res.statusCode}`)
    
        res.on('data', d=> {
            if(d.status == 'OK') {
                console.log('Database is connected and healthy.');
            }
            else if (d.status = 'failed') {
                console.log('Database is not connected. Please try again');
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

exports.healthcheck = healthcheck;