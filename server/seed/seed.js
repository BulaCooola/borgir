import { burgers, reviews, users } from "../configs/mongo/mongoCollections.js";
import { ObjectId } from "mongodb";
import { dbConnection, closeConnection } from "../configs/mongo/mongoConnections.js";
import userMethods from "../data/users.js";
import reviewMethods from "../data/reviews.js";

// Data
import {
  McDonaldsBurgers,
  BurgerKingBurgers,
  wendysBurgers,
  inNOutBurgers,
} from "./burgersDatasets.js";

const seedDatabase = async () => {
  const db = await dbConnection();
  console.log("🌱 Starting seed...");

  try {
    // 🌟 Clear existing data
    await (await burgers()).deleteMany({});
    await (await reviews()).deleteMany({});
    await (await users()).deleteMany({});
    console.log("✅ Cleared existing data.");

    // 🌟 Insert users
    const userCollection = await users();
    const user1 = await userCollection.insertOne({
      username: "burger_lover",
      email: "burgerlover@example.com",
      firstName: "John",
      lastName: "Smith",
      profilePicture: null,
    });

    const user2 = await userCollection.insertOne({
      username: "grillmaster",
      email: "grillmaster@example.com",
      firstName: "John",
      lastName: "Doe",
      profilePicture: null,
    });

    const user3 = await userCollection.insertOne({
      username: "mcyds",
      email: "mcdondon@example.com",
      firstName: "Ronald",
      lastName: "McDonald",
      profilePicture: null,
    });

    let user1_username = await userCollection.findOne({ _id: user1.insertedId });
    let user2_username = await userCollection.findOne({ _id: user2.insertedId });
    let user3_username = await userCollection.findOne({ _id: user3.insertedId });

    console.log("✅ Users seeded.");

    // 🌟 Insert burgers
    const burgerCollection = await burgers();
    const burger1 = await burgerCollection.insertOne({
      name: "Cheeseburger Deluxe",
      restaurant: "Bob's Burgers",
      description: "A classic cheeseburger with lettuce, tomato, and house sauce.",
      imageUrl: "https://example.com/cheeseburger.jpg",
      createdAt: new Date(),
    });

    const burger2 = await burgerCollection.insertOne({
      name: "Bacon BBQ Burger",
      restaurant: "Grill Kings",
      description: "Juicy beef patty with crispy bacon, BBQ sauce, and cheddar cheese.",
      imageUrl: "https://example.com/bbqburger.jpg",
      createdAt: new Date(),
    });

    // new arrays to store ObjectIds
    const mcdonaldsBurgerIds = [];
    const burgerKingBurgerIds = [];
    const wendysBurgerIds = [];
    const inNOutBurgersIds = [];

    // Import McDonald's Burgers
    for (const key in McDonaldsBurgers) {
      const burger = McDonaldsBurgers[key];
      const result = await burgerCollection.insertOne({
        name: burger.name,
        restaurant: "McDonald's",
        description: burger.description,
        imageUrl: "",
        createdAt: new Date(),
      });
      mcdonaldsBurgerIds.push(result.insertedId); // save insertedId
    }
    // Import Burger King Burgers
    for (const key in BurgerKingBurgers) {
      const burger = BurgerKingBurgers[key];
      const result = await burgerCollection.insertOne({
        name: burger.name,
        restaurant: "Burger King",
        description: burger.description,
        imageUrl: "",
        createdAt: new Date(),
      });
      burgerKingBurgerIds.push(result.insertedId); // save insertedId
    }
    // Import Wendy's Burgers
    for (const key in wendysBurgers) {
      const burger = wendysBurgers[key];
      const result = await burgerCollection.insertOne({
        name: burger.name,
        restaurant: "Wendy's",
        description: burger.description,
        imageUrl: "",
        createdAt: new Date(),
      });
      wendysBurgerIds.push(result.insertedId); // save insertedId
    }
    // Import In-N-Out's Burgers
    for (const key in inNOutBurgers) {
      const burger = inNOutBurgers[key];
      const result = await burgerCollection.insertOne({
        name: burger.name,
        restaurant: "In-N-Out",
        description: burger.description,
        imageUrl: "",
        createdAt: new Date(),
      });
      inNOutBurgersIds.push(result.insertedId); // save insertedId
    }

    console.log("✅ Burgers seeded.");

    // 🌟 Insert reviews
    const reviewCollection = await reviews();
    await reviewCollection.insertMany([
      {
        userId: user1.insertedId,
        username: user1_username.username,
        burgerId: burger1.insertedId,
        restaurantName: "Bob's Burgers",
        rating: 9,
        comment: "One of the best cheeseburgers I've had!",
        imageUrl: "",
        replies: [],
        createdAt: new Date(),
      },
      {
        userId: user2.insertedId,
        username: user2_username.username,
        burgerId: burger1.insertedId,
        restaurantName: "Bob's Burgers",
        rating: 6,
        comment: "Great burger, but I wish the bun was toasted more.",
        imageUrl: "",
        replies: [],
        createdAt: new Date(),
      },
      {
        userId: user1.insertedId,
        username: user1_username.username,
        burgerId: burger2.insertedId,
        restaurantName: "Grill Kings",
        rating: 6,
        comment: "The bacon was great, but the patty was a bit dry.",
        imageUrl: "",
        replies: [],
        createdAt: new Date(),
      },
    ]);

    await reviewCollection.insertMany([
      // McDonald's Reviews
      {
        userId: user1.insertedId,
        username: user1_username.username,
        burgerId: mcdonaldsBurgerIds[0],
        restaurantName: "McDonald's",
        rating: 7,
        comment: "Classic taste, very satisfying!",
        imageUrl: "",
        replies: [],
        createdAt: new Date(),
      },
      {
        userId: user1.insertedId,
        username: user1_username.username,
        burgerId: mcdonaldsBurgerIds[1],
        restaurantName: "McDonald's",
        rating: 6,
        comment: "Good but a little dry today.",
        imageUrl: "",
        replies: [],
        createdAt: new Date(),
      },
      {
        userId: user2.insertedId,
        username: user2_username.username,
        burgerId: mcdonaldsBurgerIds[2],
        restaurantName: "McDonald's",
        rating: 9,
        comment: "Perfectly cooked, juicy and flavorful!",
        imageUrl: "",
        replies: [],
        createdAt: new Date(),
      },
      {
        userId: user2.insertedId,
        username: user2_username.username,
        burgerId: mcdonaldsBurgerIds[3],
        restaurantName: "McDonald's",
        rating: 8,
        comment: "Great burger, fast service!",
        imageUrl: "",
        replies: [],
        createdAt: new Date(),
      },
      {
        userId: user3.insertedId,
        username: user3_username.username,
        burgerId: mcdonaldsBurgerIds[4],
        restaurantName: "McDonald's",
        rating: 2,
        comment: "Not impressed, felt rushed.",
        imageUrl: "",
        replies: [],
        createdAt: new Date(),
      },

      // Burger King Reviews
      {
        userId: user1.insertedId,
        username: user1_username.username,
        burgerId: burgerKingBurgerIds[0],
        restaurantName: "Burger King",
        rating: 10,
        comment: "Whopper is king for a reason!",
        imageUrl: "",
        replies: [],
        createdAt: new Date(),
      },
      {
        userId: user2.insertedId,
        username: user2_username.username,
        burgerId: burgerKingBurgerIds[1],
        restaurantName: "Burger King",
        rating: 4,
        comment: "Decent burger, not amazing.",
        imageUrl: "",
        replies: [],
        createdAt: new Date(),
      },
      {
        userId: user3.insertedId,
        username: user3_username.username,
        burgerId: burgerKingBurgerIds[2],
        restaurantName: "Burger King",
        rating: 6,
        comment: "Solid value for the price!",
        imageUrl: "",
        replies: [],
        createdAt: new Date(),
      },
      {
        userId: user1.insertedId,
        username: user1_username.username,
        burgerId: burgerKingBurgerIds[3],
        restaurantName: "Burger King",
        rating: 1,
        comment: "Burger was cold when I got it.",
        imageUrl: "",
        replies: [],
        createdAt: new Date(),
      },
      {
        userId: user2.insertedId,
        username: user2_username.username,
        burgerId: burgerKingBurgerIds[4],
        restaurantName: "Burger King",
        rating: 7,
        comment: "Loved every bite, fantastic service!",
        imageUrl: "",
        replies: [],
        createdAt: new Date(),
      },

      // Wendy's Reviews
      {
        userId: user3.insertedId,
        username: user3_username.username,
        burgerId: wendysBurgerIds[0],
        restaurantName: "Wendy's",
        rating: 8,
        comment: "Fresh and juicy burger, highly recommend!",
        imageUrl: "",
        replies: [],
        createdAt: new Date(),
      },
      {
        userId: user1.insertedId,
        username: user1_username.username,
        burgerId: wendysBurgerIds[1],
        restaurantName: "Wendy's",
        rating: 5,
        comment: "Pretty good, but the bun was soggy.",
        imageUrl: "",
        replies: [],
        createdAt: new Date(),
      },
      {
        userId: user2.insertedId,
        username: user2_username.username,
        burgerId: wendysBurgerIds[2],
        restaurantName: "Wendy's",
        rating: 5,
        comment: "Average burger, nothing special.",
        imageUrl: "",
        replies: [],
        createdAt: new Date(),
      },
      {
        userId: user3.insertedId,
        username: user3_username.username,
        burgerId: wendysBurgerIds[3],
        restaurantName: "Wendy's",
        rating: 8,
        comment: "Amazing quality, very impressed!",
        imageUrl: "",
        replies: [],
        createdAt: new Date(),
      },
      {
        userId: user1.insertedId,
        username: user1_username.username,
        burgerId: wendysBurgerIds[4],
        restaurantName: "Wendy's",
        rating: 9,
        comment: "Tasty burger, friendly staff!",
        imageUrl: "",
        replies: [],
        createdAt: new Date(),
      },
    ]);

    console.log("✅ Reviews seeded.");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await closeConnection();
    console.log("🌱 Seeding complete! Database connection closed.");
  }
};

// Run the seeding function
seedDatabase();
