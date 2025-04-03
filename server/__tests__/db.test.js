import { MongoClient } from "mongodb";
import { dbConnection, closeConnection } from "../configs/mongo/mongoConnections";

let db;

global.beforeAll(async () => {
  db = await dbConnection();
});

global.afterAll(async () => {
  await closeConnection();
});

test("Database connection should be established", async () => {
  const collections = await db.listCollections().toArray();
  expect(Array.isArray(collections)).toBe(true);
});

test("Database should contain the expected name", () => {
  expect(db.databaseName).toBe("Borgir");
});

test("Should be able to perform a basic insert and find", async () => {
  const testCol = db.collection("testCollection");
  await testCol.insertOne({ name: "test" });
  const found = await testCol.findOne({ name: "test" });
  expect(found.name).toBe("test");

  await testCol.deleteOne({ name: "test" }); // cleanup

  await testCol.drop();
});
