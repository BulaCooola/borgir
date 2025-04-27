import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import userMethods from "../data/users.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Signup
router.post("/signup", async (req, res, next) => {
  const { email, password, firstName, lastName, username } = req.body;

  try {
    // Validate Data
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newUser = await userMethods.createUser(email, password, firstName, lastName, username);

    res.status(201).json({ message: "User created!" });
    return;
  } catch (err) {
    next(err); // <-- sends to errorHandler middleware
  }
});

// Login
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userMethods.loginUser(email, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" }); // Email not found
    }

    //   Create token and email
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, email });
    return;
  } catch (err) {
    console.error(err);
    next(err); // <-- sends to errorHandler middleware
  }
});

export default router;
