const { companies } = require("../src/companies_c");
const { findStation } = require("../src/findStation_c");
const fs = require("fs");
const { login } = require("../src/login_c");

var already_logged_in, old_token;
const path = "softeng20bAPI.token";

beforeAll(() => {
  //save old token
  already_logged_in = fs.existsSync(path);
  if (already_logged_in) {
    old_token = fs.readFileSync(path);
    fs.unlinkSync(path);
    //console.log(JSON.parse(old_token))
  }

  //Create fake login for Unit tests
  return login("admin", "petrol4ever");
  /*
  const token = {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMDksImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwibmFtZSI6IkFkbWluaXN0cmF0b3IiLCJwYXNzd29yZCI6IiQyYiQxMCRuRE52WUt4em5hRlNEcFdZcmQyeGcuS01BOEhKcWQ2V3FEMWxQNnQuUDJDNDV1N29MdTN6MiIsImNvdW50cnkiOiJHcmVlY2UiLCJjaXR5IjoiQXRoZW5zIiwic3RyZWV0X25hbWUiOiJIZXJvb24gUG9seXRlY2huaW91Iiwic3RyZWV0X251bWJlciI6OSwicG9zdGFsX2NvZGUiOiIxNTc4MCIsInBob25lX251bWJlciI6IjIxMC03NzItMTAwMCIsImRhdGVfb2ZfYmlydGgiOiIxOTUwLTAxLTAxIiwicG9pbnRzIjowLCJzZXgiOjIsImlzX2FkbWluIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjE1NjM5MDY1fQ.Jg8LCU8tgK8hcKYsb7XgFuBNZlRY97RM1B3EPHIWcsI",
  };
  fs.writeFileSync(path, JSON.stringify(token));
  */
});

afterAll(() => {
  //replace fake_token
  if (already_logged_in) fs.writeFileSync(path, old_token);
  else if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
});

test("should return list of cities", async () => {
  const result = await findStation("Cambridge");

  if (result.length > 0) {
    expect(result[0]).toHaveProperty("StationID");
  }
});

test("should return list of cars for company", async () => {
  const result = await companies("Audi", "20210101", "20210110");

  if (result.length > 0) {
    expect(result[0]).toHaveProperty("Model");
    expect(result[0]).toHaveProperty("TotalCars");
    expect(result[0]).toHaveProperty("TotalEnergyConsumed");
    expect(result[0]).toHaveProperty("AverageEnergyPerSession");
    expect(result[0]).toHaveProperty("TotalSessions");
  }
});

test("should return empty results", async () => {
  const result1 = await companies("a", 20210102, 20210101);
  const result2 = await findStation("a");

  expect(result1).toEqual(
    "The results came up empty. Please try another request"
  );
  expect(result2).toEqual(
    "The results came up empty. Please try another request"
  );
});
