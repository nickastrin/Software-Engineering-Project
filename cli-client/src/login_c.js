const https = require("https");
const fs = require("fs");
const inquirer = require("inquirer");

const options = {
  hostname: "localhost",
  port: 8765,
  path: "/evcharge/api/login",
  method: "POST",
  rejectUnauthorized: false,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

function login(username, password) {
  const {previous_path} = require("../path")
  const path = previous_path + "/softeng20bAPI.token"

  return new Promise((resolve, reject) => {
    try {
      const body = "username=" + username + "&password=" + password;

      const req = https.request(options, (res) => {
        //console.log(`statusCode: ${res.statusCode}`)

        res.on("data", (d) => {
          if (res.statusCode == 200) {
            fs.writeFile(path, d, function (err) {
              if (err) throw err;
              resolve("Login successful!");
            });
          } else if (d == "User not found") {
            resolve("Login unsuccessful: User not found. Please try again.");
          } else if (d == "invalid password") {
            resolve(
              "Login unsuccessful: Incorrect password. Please try again."
            );
          } else {
            resolve("Error: " + d);
          }
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      if (fs.existsSync(path)) {
        inquirer
          .prompt([
            {
              name: "loginPrompt",
              message:
                "You are already logged in. Would you like to end your previous session and start a new one? (Y/N)",
              default: "Y",
            },
          ])
          .then((answers) => {
            if (answers.loginPrompt == "N") {
              resolve("You have not been logged out");
            } else if (answers.loginPrompt == "Y") {
              fs.unlink(path, function (err) {
                if (err) throw err;
              });
              req.write(body);
              req.end();
            }
          })
          .catch((error) => {
            if (error.isTtyError) {
              // Prompt couldn't be rendered in the current environment
              resolve("Prompt couldn't be rendered in the current environment");
            } else {
              // Something else went wrong
              resolve("Something else went wrong");
            }
          });
      } else {
        req.write(body);
        req.end();
      }
    } catch (err) {
      reject(err);
    }
  });
}

exports.login = login;
