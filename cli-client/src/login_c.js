const https = require('https');
const fs = require('fs');
const inquirer = require('inquirer');

const options = {
    hostname: 'localhost',
    port: 8765,
    path: '/evcharge/api/login',
    method: 'POST',
    rejectUnauthorized: false,

    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}

function login (username, password) {

    const path = "./softeng20bAPI.token";

    try {

        const body = "username=" + username + "&password=" + password;

        
    
        const req = https.request(options, res => {
            //console.log(`statusCode: ${res.statusCode}`)
        
            res.on('data', d=> {
                if (d == "User not found") {
                    console.log("Login unsuccessful: User not found. Please try again.");
                }
                else if (d == "invalid password") {
                    console.log("Login unsuccessful: Incorrect password. Please try again.");
                }
                else {
                    //process.stdout.write(d)
                    fs.writeFile('softeng20bAPI.token', d, function (err) {
                        if (err) throw err;
                        console.log("Login successful!");
                    });
                }
            })
        })
    
        req.on('error', error => {
            console.log(error);
            console.log("Something went wrong!");
        })
        
        if (fs.existsSync(path)) {
          inquirer
            .prompt ([
                {
                "name": "loginPrompt",
                "message": "You are already logged in. Would you like to end your previous session and start a new one? (Y/N)",
                "default" : "Y"
                }
            ])
            .then (answers => {
                if (answers.loginPrompt == 'N') {
                    process.exit();
                }
                else if (answers.loginPrompt == 'Y') {
                    fs.unlink('softeng20bAPI.token', function (err) {
                        if (err) throw err;
                    });
                    req.write(body);
                    req.end();
                }
            })
            .catch(error => {
                if(error.isTtyError) {
                  // Prompt couldn't be rendered in the current environment
                  console.log("Prompt couldn't be rendered in the current environment");
                } else {
                  // Something else went wrong
                  console.log("Something else went wrong");
                }
              });
        }

        else {
            req.write(body);
            req.end();
        }
      } catch(err) {
        console.error(err)
      }

    
}

exports.login = login;