const fs = require("fs");
const { sessionsPerPoint } = require("./SessionsPerPoint_c.js");
const { sessionsPerProvider } = require("./SessionsPerProvider_c.js");
const { sessionsPerStation } = require("./SessionsPerStation_c.js");
const { sessionsPerEV } = require("./SessionsPerEV_c.js");
const { login } = require("./login_c.js");

var already_logged_in, old_token;
const path = "./softeng20bAPI.token";

beforeAll(() => {
  //save old token
  already_logged_in = fs.existsSync(path);
  if (already_logged_in) {
    old_token = fs.readFileSync(path);
    //console.log(JSON.parse(old_token))
  }

  //Create fake login for Unit tests
  login("admin", "petrol4ever");
});

afterAll(() => {
  //replace fake_token
  if (already_logged_in) {
    fs.writeFileSync("./softeng20bAPI.token", old_token);
  }
});
