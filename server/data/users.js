// These will be functions that will handle methods with users server-side
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

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
  async createUser(email, password, firstName, lastName, username) {
    try {
      console.log("- - createUser Parameter Check - -");
      console.log("Email: ", email);
      console.log("Password: ", password);

      password = password.trim();
      email = email.trim();

      if (password.length <= 0 || email.length <= 0) {
        throw "Email or password must not be empty";
      }

      console.log("Email after trim: ", email);
      console.log("Password after trim: ", password);

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = {
        _id: new ObjectId(),
        email: email,
        password: passwordHash,
        username: username,
        firstName: firstName,
        lastName: lastName,
      };

      const result = await usersDB.insertOne(newUser);

      return result;
    } catch (e) {
      console.error("Error inserting user: ", e);
    }
  },

  /**
   * Checks whether a user is already registered in the database based on their ID
   * @param {string} email email of the user to be checked.
   * @returns A boolean whether the user already exists
   */
  async loginUser(email, password) {
    try {
      console.log("- - LoginUser Parameter Check - -");
      console.log("Email: ", email);
      console.log("Password: ", password);
      const user = await usersDB.findOne({ email: email }); // MongoDB native driver
      if (!user) throw "User does not exist.";

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw "Incorrect email or password.";

      return user; // Convert to boolean
    } catch (error) {
      console.error("Error checking user existence:", error);
      throw error; // Propagate error
    }
  },
};

export default userMethods;
