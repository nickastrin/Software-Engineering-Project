const https = require("https");
const fs = require("fs");
//const { manufacturercheck } = require("./check_c");
//const { datecheck } = require("./check_c");

function createOptions(manufacturer, datefrom, dateto) {
    const url = "/evcharge/api/Companies/" + manufacturer + "/" + datefrom + "/" + dateto;

    const path = "./softeng20bAPI.token";

    if(!fs.existsSync(path)) {
        console.log('User authentication required. Please sign in');
        process.exit();
    }
    const raw = fs.readFileSync(path);
    const token = JSON.parse(raw).token;

    const options = {
    hostname: "localhost",
    port: 8765,
    path: url,
    method: "GET",
    rejectUnauthorized: false,

    headers: {
        'X-OBSERVATORY-AUTH': token
    }
    };
  return options;
}

function companies(manufacturer, datefrom, dateto) {
    const path = "./softeng20bAPI.token";
    return new Promise((resolve, reject) => {
    const options = createOptions(manufacturer, datefrom, dateto);

    const req = https.request(options, (res) => {
      res.on("data", (d) => {
        if (res.statusCode == 200) {
          resolve(JSON.parse(d));
        } 
        else if (res.statusCode == 401) {
            if (fs.existsSync(path)) {
              fs.unlink(path, () => {
                resolve(
                  "User authentication failed.\nYou have been logged out. Please log in again"
                );
              });
        }
        } else if (res.statusCode == 402) {
          resolve("The results came up empty. Please try another request");
        } else {
          resolve("Status code: " + res.statusCode + "\nDetails: " + d);
        }
      });
    });
    req.on("error", (error) => {
      resolve(error);
    });

    req.end();
  });
}

exports.createOptionsCompanies = createOptions;
exports.companies = companies;