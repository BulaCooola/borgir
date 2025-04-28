// This is for uploading existing burgers and restaurants
import { ObjectId } from "mongodb";
import { burgers } from "../configs/mongo/mongoCollections.js";

const exportedMethods = {
  async getAllBurgers() {
    const burgerCollection = await burgers();
    const allBurgers = await burgerCollection.find().toArray();

    return allBurgers;
  },
  /**
   * Creates Review of a burger.
   * @param  {String} userId    User ID --> turns into ObjectId
   * @param  {String} burgerId  ID identifying the burger --> turns into ObjectId
   * @return {Object}           Return the id of the new burger document
   */
  async getOrCreateBurger(burgerName, restaurantName) {
    if (!burgerName.trim() || !restaurantName.trim()) {
      const err = new Error("Burger name and restaurant name are required.");
      err.status = 400;
      throw err;
    }

    const burgerCollection = await burgers();

    // Check if the burger already exists
    let existingBurger = await burgerCollection.findOne({
      burgerName: burgerName.toUpperCase(),
      restaurantName: restaurantName.toUpperCase(),
    });

    if (existingBurger) {
      return existingBurger._id; // Return existing burgerId
    }

    // If it doesn't exist, create a new one
    const newBurger = {
      burgerName: burgerName.toUpperCase(),
      restaurantName: restaurantName.toUpperCase(),
      createdAt: new Date(),
    };

    const insertInfo = await burgerCollection.insertOne(newBurger);
    if (!insertInfo.acknowledged) throw new Error("Failed to create new burger entry.");

    return insertInfo;
  },
  async createBurger(burgerName, restaurantName, description, imageUrl) {
    if (!burgerName.trim() || !restaurantName.trim()) {
      const err = new Error("Burger name and restaurant name are required.");
      err.status = 400;
      throw err;
    }

    const burgerCollection = await burgers();

    // Check if the burger already exists
    const existingBurger = await burgerCollection.findOne({
      burgerName: burgerName.toUpperCase(),
      restaurantName: restaurantName.toUpperCase(),
    });

    if (existingBurger) {
      const err = new Error("Cannot create duplicate burger");
      err.status = 400;
      throw err;
    }

    // Proceed with burger creation if no duplicates
    const newBurger = {
      burgerName: burgerName.toUpperCase(),
      restaurant: restaurantName.toUpperCase(),
      description: description || "",
      imageUrl: imageUrl || "",
      createdAt: new Date(),
    };

    const insertInfo = await burgerCollection.insertOne(newBurger);
    if (!insertInfo.acknowledged) throw new Error("Failed to create new burger entry.");

    return insertInfo;
  },
  async getBurger(burgerName) {
    burgerName = burgerName.trim();
    if (!burgerName) {
      const err = new Error("Burger name is required.");
      err.status = 400;
      throw err;
    }

    const burgerCollection = await burgers();

    const existingBurger = await burgerCollection.findOne({ burgerName: burgerName.toUpperCase() });

    if (!existingBurger) {
      const err = new Error("Burger name is required.");
      err.status = 404;
      throw err;
    }

    return existingBurger; // Return existing burgerId
  },

  /**
   * Gets burger review by restaurant name.
   * @param  {String} restaurantName  Burger ID of a single burger
   * @returns {Promise<Array>} - An array of review objects.
   * @throws {Error} - If no reviews are found for the restaurant.
   */
  async getBurgersByRestaurant(restaurantName) {
    // Validate the restaurant name (type and length)
    if (typeof restaurantName !== "string" || restaurantName.trim().length === 0) {
      throw new Error("Invalid restaurant name.");
    }

    // Fetch the review and find the reviews by restaurant
    const burgerCollection = await burgers();
    const restaurantReviews = await burgerCollection
      .find({ restaurant: restaurantName.trim() })
      .toArray();

    // Validate if it found any
    if (!restaurantReviews.length) throw new Error("No reviews found for this restaurant.");
    return restaurantReviews;
  },
};

export default exportedMethods;
