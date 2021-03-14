const https = require("https");
const fs = require("fs");
//const { citycheck } = require("./check_c");

function createOptions(city) {
  const url = "/evcharge/api/FindStation/" + city;

  const options = {
    hostname: "localhost",
    port: 8765,
    path: url,
    method: "GET",
    rejectUnauthorized: false,
  };
  return options;
}

function findStation(city) {
  const path = "./softeng20bAPI.token";
  return new Promise((resolve, reject) => {
    /*if (!citycheck(city)) {
      resolve("Invalid --city value.");
    }*/
    const options = createOptions(city);

    const req = https.request(options, (res) => {
      res.on("data", (d) => {
        if (res.statusCode == 200) {
          resolve(JSON.parse(d));
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

exports.createOptionsfind = createOptions;
exports.findStation = findStation;
