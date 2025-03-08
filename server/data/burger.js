// This is for uploading existing burgers and restaurants
import { ObjectId } from "mongodb";
import { burgers } from "../configs/mongo/mongoCollections.js";

const exportedMethods = {
  /**
   * Creates Review of a burger.
   * @param  {String} userId    User ID --> turns into ObjectId
   * @param  {String} burgerId  ID identifying the burger --> turns into ObjectId
   * @return {Object}           Return the id of the new burger document
   */
  async getOrCreateBurger(burgerName, restaurantName) {
    if (!burgerName.trim() || !restaurantName.trim())
      throw new Error("Burger name and restaurant name are required.");

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

    return insertInfo.insertedId;
  },
};

export default exportedMethods;
