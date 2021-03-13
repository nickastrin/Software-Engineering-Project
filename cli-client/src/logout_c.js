const https = require("https");
const fs = require("fs");

const path = "./softeng20bAPI.token";

function logout() {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(path)) {
      const raw = fs.readFileSync(path);
      const token = JSON.parse(raw).token;

      const options = {
        hostname: "localhost",
        port: 8765,
        path: "/evcharge/api/logout",
        method: "POST",
        rejectUnauthorized: false,

        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-OBSERVATORY-AUTH": token,
        },
      };

      const req = https.request(options, (res) => {
        //console.log(`statusCode: ${res.statusCode}`)

        res.on("data", (d) => {
          if (res.statusCode == 403) {
            fs.unlink(path, () => {
              resolve("Session has already expired");
            });
          } else if (res.statusCode == 200) {
            fs.unlink(path, () => {
              resolve("You are no longer logged in");
            });
          } else {
            resolve("Something went wrong! Status code: ", res.statusCode);
          }
        });
      });
      req.on("error", (error) => {
        resolve(error + "\nSomething went wrong!");
      });

      req.end();
    } else {
      resolve("You are not currently logged in");
    }
  });
}

exports.logout = logout;
