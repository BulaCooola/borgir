import { MongoClient, ObjectId } from "mongodb";
import { dbConnection, closeConnection } from "../configs/mongo/mongoConnections";

let db;

beforeAll(async () => {
  db = await dbConnection();
});

afterAll(async () => {
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

import { burgers } from "../configs/mongo/mongoCollections.js";
import burgerMethods from "../data/burger.js";

let burgerCollection;

// Fetch the burger database
test("Database connection should be established", async () => {
  burgerCollection = await burgers();
  expect(typeof burgerCollection == "object").toBe(true);
});

// Create a burger submission
test("Create a burger submission", async () => {
  const burgerSubmission = await burgerMethods.getOrCreateBurger(
    "Test Burger Name",
    "Test Burger Restaurant"
  );

  console.log(`burgerSubmission: ${burgerSubmission}`);
  // await burgerSubmission.remove({ id: 1 }, { multi: true });

  const getBurger = await burgerCollection.findOne({ _id: burgerSubmission });

  expect(getBurger.burgerName).toBe("TEST BURGER NAME");
});
