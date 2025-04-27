// These will be functions that will handle methods with users server-side
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

import { users } from "../configs/mongo/mongoCollections.js";

const userMethods = {
  /**
   *
   * Adds a new user to the DB
   * @param {id}
   * @param {email}
   * @param {username}
   * @param {pic}
   */
  async createUser(email, password, firstName, lastName, username) {
    password = password.trim();
    email = email.trim();

    if (password.length <= 0 || email.length <= 0) {
      const err = new Error("Email or password must not be empty");
      err.status = 400;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usersDB = await users();

    const existingUser = await usersDB.findOne({ email });

    console.log("Existing User?", existingUser);

    if (existingUser) {
      const err = new Error("Email already in use");
      err.status = 409;
      throw err;
    } else {
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
    }
  },

  /**
   * Checks whether a user is already registered in the database based on their ID
   * @param {string} email email of the user to be checked.
   * @returns A boolean whether the user already exists
   */
  async loginUser(email, password) {
    const usersDB = await users();
    const user = await usersDB.findOne({ email: email }); // MongoDB native driver
    if (!user) {
      const err = new Error("User does not exist.");
      err.status = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error("Incorrect email or password.");
      err.status = 401;
      throw err;
    }

    return user;
  },
};

export default userMethods;
