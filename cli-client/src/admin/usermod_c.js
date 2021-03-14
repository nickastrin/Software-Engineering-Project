const https = require("https");
const fs = require("fs");
const inquirer = require("inquirer");

async function usermod(username, password) {
  const url = "/evcharge/api/admin/usermod/" + username + "/" + password;
    const {previous_path} = require("../../path")
  const path = previous_path + "/softeng20bAPI.token"
  let body;

  if (!fs.existsSync(path)) {
    console.log("User authentication required. Please sign in");
    process.exit();
  }

  if (username.length < 3) {
    console.log("Username is too short. Must be at least 3 characters");
    process.exit();
  }

  if (password.length < 8) {
    console.log("Username is too short. Must be at least 8 characters");
    process.exit();
  }

  const raw = fs.readFileSync(path);
  const token = JSON.parse(raw).token;

  const create = await inquirer.prompt([
    {
      type: "list",
      name: "creating",
      message: "Are you creating a user or updating a password?",
      default: "creating",
      choices: ["creating", "updating"],
    },
  ]);

  const newUser = create.creating == "creating";

  if (newUser) {
    body = await inquirer.prompt([
      {
        name: "name",
        message: "Give full name of the user:",
        default: "Name",
      },
      {
        name: "email",
        message: "Give email of the new user:",
      },
      {
        name: "country",
        message: "Give the country of the new user:",
        default: "Greece",
      },
      {
        name: "city",
        message: "Give the city of the new user:",
        default: "Athens",
      },
      {
        name: "street_name",
        message: "Give street name of the new user:",
        default: "Ermou",
      },
      {
        name: "street_number",
        message: "Give street number of the new user:",
        default: "17",
      },
      {
        name: "postal_code",
        message: "Give postal code of the new user:",
        default: "15780",
      },
      {
        name: "phone_number",
        message: "Give the phone number of the new user:",
        default: "000-000-0000",
      },
      {
        name: "date_of_birth",
        message: "Give the date of birth of the new user (Format YYYY-MM-DD):",
        default: "1980-05-20",
      },
      {
        type: "list",
        name: "sex",
        message: "Choose new user's sex:",
        choices: ["Male", "Female", "Other"],
        default: "Other",
      },
      {
        type: "list",
        name: "is_admin",
        message: "Is it an admin account?",
        choices: ["Yes", "No"],
        default: "No",
      },
    ]);

    body.is_admin = body.is_admin == "Yes" ? 1 : 0;
    if (body.sex == "Male") {
      body.sex = 0;
    } else if (body.sex == "Female") {
      body.sex = 1;
    } else {
      body.sex = 2;
    }

    if (!RegExp("^([a-z]+@[a-z]+.[a-z]+)$").test(body.email)) {
      console.log("Invalid email");
      process.exit();
    }
    if (parseInt(body.street_number) == NaN) {
      console.log("Invalid Street Number");
      process.exit();
    }

    const parts = body.date_of_birth.split("-");
    if (parts.length != 3) {
      console.log("1");
      console.log("Incorrect Date format. Format should be YYYY-MM-DD");
      process.exit();
    }
    if (parseInt(parts[2]) > 31) {
      console.log("2");
      console.log("Incorrect Date format. Format should be YYYY-MM-DD");
      process.exit();
    } else if (parseInt(parts[1]) > 12) {
      console.log("3");
      console.log("Incorrect Date format. Format should be YYYY-MM-DD");
      process.exit();
    } else if (parseInt(parts[2] < 1960)) {
      console.log("Incorrect Date format. Format should be YYYY-MM-DD");
      process.exit();
    }

    if (body.country < 3) {
      console.log("Country name is too short. Must be at least 3 characters");
      process.exit();
    }
    if (body.city < 3) {
      console.log("City name is too short. Must be at least 3 characters");
      process.exit();
    }
    if (body.country < 3) {
      console.log("Country name is too short. Must be at least 3 characters");
      process.exit();
    }

    body.street_number = parseInt(body.street_number);
    body.username = username;
    body.password = password;
    body.points = 0;
    //console.log(body);
  }

  const options = {
    hostname: "localhost",
    port: 8765,
    path: url,
    method: "POST",
    rejectUnauthorized: false,

    headers: {
      "X-OBSERVATORY-AUTH": token,
      "Content-Type": "application/json",
    },
  };

  const req = https.request(options, (res) => {
    //console.log(`statusCode: ${res.statusCode}`)

    res.on("data", (d) => {
      if (res.statusCode == 200) {
        if (d == "Created") {
          console.log("User with username: " + username + " has been created");
        } else if (d == "Updated") {
          console.log("User's: " + username + " password changed");
        }
      } else {
        console.log("Status code: " + res.statusCode);
        console.log("Details: " + d);
      }
    });
  });
  req.on("error", (error) => {
    console.log(error);
    console.log("Something went wrong!");
  });

  if (newUser) {
    req.write(JSON.stringify(body));
  }
  req.end();
}

exports.usermod = usermod;
