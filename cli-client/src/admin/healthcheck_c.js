const https= require('https');
  const {previous_path} = require("../../path")
  const path = previous_path + "/softeng20bAPI.token"
function healthcheck () {
    

    const options = {
        hostname: 'localhost',
        port: 8765,
        path: '/evcharge/api/admin/healthcheck',
        method: 'GET',
        rejectUnauthorized: false
    }

    const req = https.request(options, res => {
        //console.log(`statusCode: ${res.statusCode}`)
    
        res.on('data', d=> {
            //console.log(res.statusCode);
            console.log(JSON.parse(d));
        })
    })
    req.on('error', error => {
        console.log(error);
        console.log("Something went wrong!");
    })

    req.end();
}

exports.healthcheck = healthcheck;