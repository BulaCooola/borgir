import { burgers } from "../configs/mongo/mongoCollections.js";
import { dbConnection, closeConnection } from "../configs/mongo/mongoConnections.js";
import burgerMethods from "../data/burger.js";

let db;
let burgerCollection;

// Fetch the burger database
test("Database connection should be established", async () => {
  burgerCollection = await burgers();
  expect(typeof burgerCollection == "object").toBe(true);
});

// Create a burger submission
test("Create a burger submission", async () => {
  const burgerSubmission = burgerMethods.getOrCreateBurger(
    "Test Burger Name",
    "Test Burger Restaurant"
  );

  // await burgerSubmission.remove({ id: 1 }, { multi: true });

  expect(burgerSubmission.id).toBe(1);
});
