const https = require("https");
const fs = require("fs");
const { stationcheck, datecheck } = require("./check_c");

function createOptions(stationid, from, to, format) {
  const date = new RegExp("^([0-9]{8})$");
  const station = new RegExp("^([0-9]+)$");

  if (!station.test(stationid)) {
    console.log("Invalid --station value. Value must be an integer");
    process.exit();
  }

  if (!date.test(from)) {
    console.log("Invalid --datefrom value. Value must have form YYYYMMDD");
    process.exit();
  }

  if (!date.test(to)) {
    console.log("Invalid --datet value. Value must have form YYYYMMDD");
    process.exit();
  }

  if (format != "csv" && format != "json") {
    console.log("Invalid format option. Supported options: json csv");
    process.exit();
  }

  const url =
    "/evcharge/api/SessionsPerStation/" +
    stationid +
    "/" +
    from +
    "/" +
    to +
    "?format=" +
    format;
  const path = "./softeng20bAPI.token";

  if (!fs.existsSync(path)) {
    console.log("User authentication required. Please sign in");
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
      "X-OBSERVATORY-AUTH": token,
    },
  };
  return options;
}

function sessionsPerStation(stationid, from, to, format) {
  const path = "./softeng20bAPI.token";
  return new Promise((resolve, reject) => {
    if (!stationcheck(stationid)) {
      resolve("Invalid --station value. Value must be an integer");
    }

    if (!datecheck(from)) {
      resolve("Invalid --datefrom value. Value must have form YYYYMMDD");
    }

    if (!datecheck(to)) {
      resolve("Invalid --dateto value. Value must have form YYYYMMDD");
    }

    if (format != "csv" && format != "json") {
      resolve("Invalid format option. Supported options: json csv");
    }

    if (!fs.existsSync(path)) {
      resolve("User authentication required. Please sign in");
    }

    const options = createOptions(stationid, from, to, format);

    const req = https.request(options, (res) => {
      res.on("data", (d) => {
        if (res.statusCode == 200) {
          if (format === "json") {
            resolve(JSON.parse(d));
            //process.stdout.write(d + "\n");
          } else {
            resolve(d);
          }
        } else if (res.statusCode == 401) {
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

exports.createOptionsStation = createOptions;
exports.sessionsPerStation = sessionsPerStation;
