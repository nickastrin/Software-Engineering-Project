const https = require('https');
const fs = require('fs');
const formdata = require('form-data');

function sessionsupd (source) {

    const url = '/evcharge/api/admin/system/sessionsupd';
      const {previous_path} = require("../../path")
  const path = previous_path + "/softeng20bAPI.token"
    
    const form = new formdata();
    form.append("file", fs.createReadStream(source));
    
    if(!fs.existsSync(source)) {
        console.log('The source file path is not valid');
        process.exit();
    }

    if(!fs.existsSync(path)) {
        console.log('User authentication required. Please sign in');
        process.exit();
    }

    const raw = fs.readFileSync(path);
    const token = JSON.parse(raw).token;
  
    const options = {
        hostname: 'localhost',
        port: 8765,
        path: url,
        method: "POST",
        rejectUnauthorized: false,
        headers: {
            'X-OBSERVATORY-AUTH': token,
            "Content-Type": "multipart/form-data",
            ...form.getHeaders()
        }
    };

    const req = https.request(options, res => {
        //console.log(`statusCode: ${res.statusCode}`)
    
        res.on('data', d=> {
            if(res.statusCode == 200) {
                console.log(JSON.parse(JSON.stringify(d)));
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

    form.pipe(req);
}

exports.sessionsupd = sessionsupd;