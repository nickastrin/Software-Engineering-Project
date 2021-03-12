const https = require('https');
const fs = require('fs');

function createOptions(providerid, from, to, format){
    const date = new RegExp("^([0-9]{8})$");
    const provider = new RegExp("^([0-9]+)$");

    if(!provider.test(providerid)) {
        console.log('Invalid --provider value. Value must be an integer');
        process.exit();
    }

    if(!date.test(from)) {
        console.log('Invalid --datefrom value. Value must have form YYYYMMDD');
        process.exit();
    }

    if(!date.test(to)) {
        console.log('Invalid --datet value. Value must have form YYYYMMDD');
        process.exit();
    }

    if(format != 'csv' && format != 'json') {
        console.log('Invalid format option. Supported options: json csv');
        process.exit();
    }

    const url = '/evcharge/api/SessionsPerProvider/' + providerid + '/' + from + '/' + to + '?format=' + format;
    const path = "./softeng20bAPI.token";
    
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
        method: 'GET',
        rejectUnauthorized: false,

        headers: {
            'X-OBSERVATORY-AUTH': token
        }
    }
    return options;

}

function sessionsPerProvider (providerid, from, to, format) {

    const options = createOptions(providerid, from, to, format)

    const req = https.request(options, res => {
        //console.log(`statusCode: ${res.statusCode}`)
    
        res.on('data', d=> {
            if(res.statusCode == 200) {
                if(format==='json'){
                    //process.stdout.write(d+'\n')
                    obj=JSON.parse(d)
                    console.log(obj);
                }
                else if (format==='csv'){
                    process.stdout.write(d+'\n')
                }
                else{
                    console.log(`Format "${format}" is not recognised as a format type. \
Accepted formats are "json" and "csv".`)
                }
            }
            else if(res.statusCode == 401) {
                console.log('User authentication failed.');
                if(fs.existsSync(path)) {
                    fs.unlink(path, () => {
                        console.log('You have been logged out. Please log in again');
                    });
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

exports.createOptionsProvider = createOptions;
exports.sessionsPerProvider = sessionsPerProvider;