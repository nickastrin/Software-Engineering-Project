const https = require("https");
const fs = require("fs");
const { evcheck, datecheck } = require("./check_c");

function createOptions(evid, from, to, format) {
  const url =
    "/evcharge/api/SessionsPerEV/" +
    evid +
    "/" +
    from +
    "/" +
    to +
    "?format=" +
    format;
  const path = "./softeng20bAPI.token";

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

function sessionsPerEV(evid, from, to, format) {
  const path = "./softeng20bAPI.token";
  return new Promise((resolve, reject) => {
    if (!evcheck(evid)) {
      resolve("Invalid --ev value. Value must have form ABC-1234");
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

    const options = createOptions(evid, from, to, format);

    const req = https.request(options, (res) => {
      res.on("data", (d) => {
        if (res.statusCode == 200) {
          if (format === "json") {
            resolve(JSON.parse(d));
            //process.stdout.write(d + "\n");
          } else {
            resolve(decodeURIComponent(d));
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

exports.createOptionsEV = createOptions;
exports.sessionsPerEV = sessionsPerEV;
