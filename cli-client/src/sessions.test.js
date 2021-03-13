const fs = require("fs");
const { sessionsPerPoint } = require("./SessionsPerPoint_c.js");
const { sessionsPerProvider } = require("./SessionsPerProvider_c.js");
const { sessionsPerStation } = require("./SessionsPerStation_c.js");
const { sessionsPerEV } = require("./SessionsPerEV_c.js");
const { login } = require("./login_c.js");
const { TestScheduler } = require("@jest/core");
const { hasUncaughtExceptionCaptureCallback } = require("process");
const { expect, test } = require("@jest/globals");
const { async } = require("rsvp");

var already_logged_in, old_token;
const path = "./softeng20bAPI.token";

beforeAll(async () => {
  //save old token
  already_logged_in = fs.existsSync(path);
  if (already_logged_in) {
    old_token = fs.readFileSync(path);
    fs.unlinkSync(path);
    //console.log(JSON.parse(old_token))
  }

  //Create fake login for Unit tests
  await login("admin", "petrol4ever");
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
  else fs.unlinkSync(path);
});

test("should return sessionsPerEV in json form", async () => {
  const result = await sessionsPerEV(
    "DBG-5962",
    "20210101",
    "20210102",
    "json"
  );

  expect(result).toHaveProperty("VehicleID");
  expect(result).toHaveProperty("TotalEnergyConsumed");
  expect(result).toHaveProperty("NumberOfVisitedPoints");
});

test("should return sessionsPerEV in csv form", async () => {
  const raw = await sessionsPerEV("DBG-5962", "20210101", "20210102", "csv");
  const result = decodeURIComponent(raw);

  const fields =
    "VehicleID,RequestTimestamp,PeriodFrom,PeriodTo,TotalEnergyConsumed,NumberOfVisitedPoints,NumberOfVehicleChargingSessions,VehicleChargingSessionsList";

  expect(result).toEqual(expect.stringContaining(fields));
});

/*
test("should return sessionsPerStation in json form", () => {
  return sessionsPerStation("25", "20210101", "20210110", "json").then((result) => {
    expect(result).toHaveProperty("StationID");
    expect(result).toHaveProperty("Operator");
    expect(result).toHaveProperty("TotalEnergyDelivered");
    expect(result).toHaveProperty("Number");
  });
});
*/

test("should return sessionsPerStation in json form", async () => {
  const result = await sessionsPerStation("25", "20210101", "20210110", "json");

  expect(result).toHaveProperty("StationID");
  expect(result).toHaveProperty("Operator");
  expect(result).toHaveProperty("TotalEnergyDelivered");
});

test("should return sessionsPerStation in csv form", async () => {
  const raw = await sessionsPerStation("1", "20210101", "20210110", "csv");
  const result = decodeURIComponent(raw);

  const fields =
    "StationID,Operator,RequestTimestamp,PeriodFrom,PeriodTo,TotalEnergyDelivered,NumberOfChargingSessions,NumberOfActivePoints,SessionsSummaryList";
  expect(result).toEqual(expect.stringContaining(fields));
});

test("should return sessionsPerPoint in json form", async () => {
  const result = await sessionsPerPoint("1-1", "20210101", "20210110", "json");

  expect(result).toHaveProperty("Point");
  expect(result).toHaveProperty("PointOperator");
  expect(result).toHaveProperty("NumberOfChargingSessions");
});

test("should return sessionsPerPoint in csv form", async () => {
  const raw = await sessionsPerPoint("1-1", "20210101", "20210110", "csv");
  const result = decodeURIComponent(raw);

  const fields =
    "Point,PointOperator,RequestTimestamp,PeriodFrom,PeriodTo,NumberOfChargingSessions,ChargingSessionsList";

  expect(result).toEqual(expect.stringContaining(fields));
});

test("should return sessionsPerProvider in json form", async () => {
  const result = await sessionsPerProvider("7", "20210101", "20210102", "json");

  expect(result).toHaveProperty("ProviderID");
  expect(result).toHaveProperty("ProviderName");
  expect(result).toHaveProperty("Sessions");
});

test("should return sessionsPerProvider in csv form", async () => {
  const raw = await sessionsPerProvider("1", "20210101", "20210110", "csv");
  const result = decodeURIComponent(raw);

  const fields = "ProviderID,ProviderName,Sessions";

  expect(result).toEqual(expect.stringContaining(fields));
});

test("should return empty results in all cases", async () => {
  const result1 = await sessionsPerStation("1", "20210102", "20210101", "json");
  const result2 = await sessionsPerPoint("1-1", "20210102", "20210101", "json");
  const result3 = await sessionsPerProvider(
    "1",
    "20210102",
    "20210101",
    "json"
  );
  const result4 = await sessionsPerEV(
    "ABC-1234",
    "20210102",
    "20210101",
    "json"
  );

  expect(result1).toEqual(
    "The results came up empty. Please try another request"
  );
  expect(result2).toEqual(
    "The results came up empty. Please try another request"
  );
  expect(result3).toEqual(
    "The results came up empty. Please try another request"
  );
  expect(result4).toEqual(
    "The results came up empty. Please try another request"
  );
});
