// These will be functions that will handle methods with users server-side
import { ObjectId } from "mongodb";
import { users, reviews } from "../configs/mongo/mongoCollections.js";

const usersDB = await users();
const reviewsDB = await reviews();

const userMethods = {
  /**
   * Adds a new user to the DB
   * @param {id}
   * @param {email}
   * @param {username}
   * @param {pic}
   */
  async createUser(userId, email, username, firstName, lastName, pic) {
    try {
      const newUser = {
        _id: userId,
        email,
        username,
        firstName,
        lastName,
        profilePicture: pic,
      };

      const result = await usersDB.insertOne(newUser);

      return result;
    } catch (e) {
      console.error("Error inserting user: ", e);
    }
  },

  /**
   * Checks whether a user is already registered in the database based on their ID
   * @param {id} The ID of the user to be checked.
   * @returns A boolean whether the user already exists
   */
  async userExists(id) {
    try {
      const exists = await usersDB.findOne({ _id: id }); // MongoDB native driver
      return !!exists; // Convert to boolean
    } catch (error) {
      console.error("Error checking user existence:", error);
      throw error; // Propagate error
    }
  },
};

export default userMethods;
