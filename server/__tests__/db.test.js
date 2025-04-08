import { MongoClient, ObjectId } from "mongodb";
import { dbConnection, closeConnection } from "../configs/mongo/mongoConnections";
import { burgers, reviews, users } from "../configs/mongo/mongoCollections.js";
import burgerMethods from "../data/burger.js";

// let db;

// beforeAll(async () => {
//   db = await dbConnection();
// });

afterAll(async () => {
  await closeConnection();
});

// describe("Test database connections", () => {
//   test("Database connection should be established", async () => {
//     const collections = await db.listCollections().toArray();
//     expect(Array.isArray(collections)).toBe(true);
//   });

//   test("Database should contain the expected name", () => {
//     expect(db.databaseName).toBe("Borgir");
//   });

//   test("Should be able to perform a basic insert and find", async () => {
//     const testCol = db.collection("testCollection");
//     await testCol.insertOne({ name: "test" });
//     const found = await testCol.findOne({ name: "test" });
//     expect(found.name).toBe("test");

//     await testCol.deleteOne({ name: "test" }); // cleanup

//     await testCol.drop();
//   });
// });

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

  // await burgerSubmission.remove({ id: 1 }, { multi: true });

  const getBurger = await burgerCollection.findOne({ _id: burgerSubmission.insertedId });

  await burgerCollection.deleteOne({ _id: burgerSubmission.insertedId });

  expect(getBurger.burgerName).toBe("TEST BURGER NAME");
});
