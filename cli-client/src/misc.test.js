const { findStation } = require("./findStation_c");

test("should return list of cities", async () => {
  const result = await findStation("Cambridge");

  if (result.length > 0) {
    expect(result[0]).toHaveProperty("StationID");
  }
});
