import { MongoClient, ObjectId } from "mongodb";
import request from "supertest";
import jwt from "jsonwebtoken";
import { server, app } from "../app.js";

import { dbConnection, closeConnection } from "../configs/mongo/mongoConnections.js";
import { burgers, reviews, users } from "../configs/mongo/mongoCollections.js";
import burgerMethods from "../data/burger.js";

// let db;

afterAll(async () => {
  await closeConnection();
});

afterAll(() => {
  // Ensure the server is closed after tests
  server.close();
});

// describe("Test database connections", () => {
//   let db;
//   test("Database connection should be established", async () => {
//     db = await dbConnection();
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
let userCollection;
let mockUserId;
let token_mock;

describe("Test auth functions", () => {
  const mockUser = {
    email: "borgir_example@outlook.com",
    password: "securePassword123",
    firstName: "Borgir",
    lastName: "Boy",
    username: "borgirboy",
  };

  test("User signup should return 201", async () => {
    const res = await request(app).post("/auth/signup").send(mockUser);
    console.log(res.statusCode);

    expect(res.statusCode).toBe(201);
  });

  test("Duplicate signup should return 409", async () => {
    const res = await request(app).post("/auth/signup").send(mockUser);
    console.log(res.statusCode);

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("error");
  });

  test("Login with correct credentials should return token", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: mockUser.email, password: mockUser.password });
    console.log(res.statusCode);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token_mock = res.body.token;

    userCollection = await users();
    let get_mock_user = await userCollection.findOne({ username: "borgirboy" });
    mockUserId = get_mock_user._id;
  });

  test("Login with wrong password should fail", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: mockUser.email, password: "wrongPassword" });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
});

describe("Burger Routes", () => {
  // Test POST /burgers
  test("should create a new burger", async () => {
    burgerCollection = await burgers();
    const newBurger = {
      name: "Chezburger",
      restaurant: "WcDonald's Roblox",
      description: "A tasty cheeseburger",
      imageUrl: "http://image.url",
    };

    const response = await request(app).post("/burgers").send(newBurger);
    console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("name", newBurger.name);
    expect(response.body).toHaveProperty("restaurant", newBurger.restaurant);
  });

  // Test GET /burgers
  test("should get all burgers", async () => {
    const response = await request(app).get("/burgers");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test GET /burgers/:id
  test("should get a burger by ID", async () => {
    // First, create a burger to fetch
    const newBurger = {
      name: "Bacon Burger",
      restaurant: "McDonalds",
      description: "A bacon-filled burger",
      imageUrl: "http://image.url",
    };

    const createResponse = await request(app).post("/burgers").send(newBurger);
    const burgerId = createResponse.body._id;

    const response = await request(app).get(`/burgers/${burgerId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", burgerId);
  });

  // Test GET /burgers/restaurant/:restaurant
  test("should get all burgers from a specific restaurant", async () => {
    const response = await request(app).get("/burgers/restaurant/McDonalds");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test PUT /burgers/:id
  test("should update a burger by ID", async () => {
    const newBurger = {
      name: "Veggie Burger",
      restaurant: "Veggie World",
      description: "A healthy veggie burger",
      imageUrl: "http://image.url",
    };

    const createResponse = await request(app).post("/burgers").send(newBurger);
    const burgerId = createResponse.body._id;

    const updatedBurger = {
      name: "Vegan Burger",
      restaurant: "Vegan World",
      description: "A tasty vegan burger",
      imageUrl: "http://updated-image.url",
    };

    const response = await request(app).put(`/burgers/${burgerId}`).send(updatedBurger);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name", updatedBurger.name);
    expect(response.body).toHaveProperty("restaurant", updatedBurger.restaurant);
  });

  // Test DELETE /burgers/:id
  test("should delete a burger by ID", async () => {
    const newBurger = {
      name: "Spicy Burger",
      restaurant: "Spicy King",
      description: "A very spicy burger",
      imageUrl: "http://image.url",
    };

    const createResponse = await request(app).post("/burgers").send(newBurger);
    const burgerId = createResponse.body._id;

    const response = await request(app).delete(`/burgers/${burgerId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Burger deleted successfully");

    // Delete the rest of the burgers
    // await burgerCollection.deleteOne({ name: "Chezburger", restaurant: "WcDonald's Roblox" });
    await burgerCollection.deleteOne({ name: "Vegan Burger", restaurant: "Vegan World" });
    await burgerCollection.deleteOne({ name: "Bacon Burger", restaurant: "McDonalds" });
  });
});

jest.mock("../middleware/auth.js", () => (req, res, next) => {
  console.log("Reached Mock Middleware");
  // const token = req.headers.authorization?.split(" ")[1];
  // const decoded = jwt.verify(token, JWT_SECRET);
  // req.user = decoded;
  req.user = { id: mockUserId }; // Optional if needed later
  next();
});

describe("Reviews API", () => {
  let reviewTest;
  const fakeUser = { id: mockUserId }; // set any id you want
  const token = jwt.sign(fakeUser, process.env.JWT_SECRET, { expiresIn: "1h" });

  test("GET /reviews should return paginated reviews", async () => {
    const response = await request(app)
      .get("/reviews?offset=0&limit=10")
      .set("Authorization", `Bearer ${token_mock}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test("POST /reviews should create a new review", async () => {
    const theBurger = await burgerCollection.findOne({
      name: "Chezburger",
      restaurant: "WcDonald's Roblox",
    });
    const reviewData = {
      burgerId: theBurger._id,
      restaurantName: "WcDonald's Roblox",
      rating: 5,
      comment: "Delicious burger!",
      imageUrl: "http://image.url",
    };

    const response = await request(app)
      .post("/reviews")
      .send(reviewData)
      .expect("Content-Type", /json/)
      .set("Authorization", `Bearer ${token_mock}`);

    reviewTest = response.body;
    console.log("POST /reviews: ", response.body);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("burgerId", theBurger._id.toString());
    expect(response.body.rating).toBe(5);
  });

  test("GET /reviews/:reviewId should return a review by ID", async () => {
    const reviewId = reviewTest._id.toString();
    const response = await request(app)
      .get(`/reviews/${reviewId}`)
      .set("Authorization", `Bearer ${token_mock}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", reviewId);
  });

  test("DELETE /reviews/:reviewId should delete a review", async () => {
    const reviewId = reviewTest._id.toString();
    const response = await request(app)
      .delete(`/reviews/${reviewId}`)
      .set("Authorization", `Bearer ${token_mock}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Review deleted successfully.");

    await burgerCollection.deleteOne({ name: "Chezburger", restaurant: "WcDonald's Roblox" });
  });

  test("GET /reviews/user/:userId should retrieve all reviews by a user", async () => {
    //
  });
});

it("Delete the mock user", async () => {
  const usersCollection = await users();
  const response = await usersCollection.deleteOne({ email: "borgir_example@outlook.com" });

  expect(response.deletedCount).toBe(1); // Ensure the user is deleted
});
