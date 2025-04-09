import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import userMethods from "../data/users.js";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName, username } = req.body;

  try {
    // Validate Data
    if (!firstName || !firstName || !username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newUser = await userMethods.createUser(email, password, firstName, lastName, username);

    console.log("POST /signup - Newuser: ", newUser);
    res.status(201).json({ message: "User created!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userMethods.loginUser(email, password);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    //   Create token and email
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, email });
  } catch (e) {
    email;
    res.status(400).json({ error: "Username taken or invalid." });
  }
});

export default router;
