import { burgers, reviews, users } from "./configs/mongo/mongoCollections.js";
import { ObjectId } from "mongodb";
import { dbConnection, closeConnection } from "./configs/mongo/mongoConnections.js";

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
      passwordHash: "hashed_password_1", // Replace with real hashed passwords in production
    });

    const user2 = await userCollection.insertOne({
      username: "grillmaster",
      email: "grillmaster@example.com",
      passwordHash: "hashed_password_2",
    });

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

    console.log("✅ Burgers seeded.");

    // 🌟 Insert reviews
    const reviewCollection = await reviews();
    await reviewCollection.insertMany([
      {
        burgerId: burger1.insertedId,
        userId: user1.insertedId,
        rating: 5,
        comment: "One of the best cheeseburgers I've had!",
        createdAt: new Date(),
      },
      {
        burgerId: burger1.insertedId,
        userId: user2.insertedId,
        rating: 4,
        comment: "Great burger, but I wish the bun was toasted more.",
        createdAt: new Date(),
      },
      {
        burgerId: burger2.insertedId,
        userId: user1.insertedId,
        rating: 3,
        comment: "The bacon was great, but the patty was a bit dry.",
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
