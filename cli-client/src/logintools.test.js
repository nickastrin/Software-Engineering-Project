const { expect, test } = require("@jest/globals");
const fs = require("fs");
const { login } = require("./login_c.js");
const { logout } = require("./logout_c.js");
var already_logged_in, old_token;
const path = "./softeng20bAPI.token";

beforeAll(() => {
  //save old token
  already_logged_in = fs.existsSync(path);
  if (already_logged_in) {
    old_token = fs.readFileSync(path);
    fs.unlinkSync(path);
    //console.log(JSON.parse(old_token))
  }
});

afterAll(() => {
  //replace fake_token
  if (already_logged_in) fs.writeFileSync(path, old_token);
  else if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
});

test("should fail login because of bad username", async () => {
  const result = await login("a", "a");
  expect(result).toEqual(
    "Login unsuccessful: User not found. Please try again."
  );
});

test("should fail login because of bad password", async () => {
  const result = await login("admin", "a");
  expect(result).toEqual(
    "Login unsuccessful: Incorrect password. Please try again."
  );
});

test("should successfully login", async () => {
  const result = await login("admin", "petrol4ever");
  expect(result).toEqual("Login successful!");
});

test("should logout", async () => {
  const result = await logout();
  expect(result).toEqual("You are no longer logged in");
});

test("should fail to logout", async () => {
  const result = await logout();
  expect(result).toEqual("You are not currently logged in");
});

test("should return error", async () => {
  token = {
    token: "12345678",
  };
  fs.writeFileSync(path, JSON.stringify(token));

  const result = await logout();
  expect(result).toEqual(expect.stringContaining("Something went wrong"));
});
