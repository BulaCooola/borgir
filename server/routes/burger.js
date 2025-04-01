import express from "express";
import { burgers } from "../configs/mongo/mongoCollections.js";
import { ObjectId } from "mongodb";
import { requireAuth } from "@clerk/express";

const router = express.Router();

/**
 * @route   POST /burgers
 * @desc    Create a new burger entry
 * @access  Private (Requires authentication)
 */
router.post("/", requireAuth(), async (req, res) => {
  // * Good
  try {
    const { name, restaurant, description, imageUrl } = req.body;
    if (!name || !restaurant) {
      return res.status(400).json({ error: "Burger name and restaurant are required" });
    }

    const burgerCollection = await burgers();
    const existingBurger = await burgerCollection.findOne({ name, restaurant });

    if (existingBurger) {
      return res.status(400).json({ error: "Burger already exists in this restaurant" });
    }

    const newBurger = {
      name,
      restaurant,
      description: description || "",
      imageUrl: imageUrl || "",
      createdAt: new Date(),
    };

    const { insertedId } = await burgerCollection.insertOne(newBurger);
    res.status(201).json({ ...newBurger, _id: insertedId });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @route   GET /burgers
 * @desc    Get all burgers
 * @access  Public
 */
router.get("/", async (req, res) => {
  // * Good
  try {
    const burgerCollection = await burgers();
    const allBurgers = await burgerCollection.find({}).toArray();
    res.json(allBurgers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch burgers" });
  }
});

/**
 * @route   GET /burgers/:id
 * @desc    Get a burger by ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  // * Good
  try {
    const burgerId = req.params.id;
    if (!ObjectId.isValid(burgerId)) return res.status(400).json({ error: "Invalid burger ID" });

    const burgerCollection = await burgers();
    const burger = await burgerCollection.findOne({ _id: new ObjectId(burgerId) });

    if (!burger) return res.status(404).json({ error: "Burger not found" });

    res.json(burger);
  } catch (error) {
    res.status(500).json({ error: "Error fetching burger" });
  }
});

/**
 * @route   GET /burgers/restaurant/:restaurant
 * @desc    Get all burgers from a specific restaurant
 * @access  Public
 */
router.get("/restaurant/:restaurant", async (req, res) => {
  // * Good
  try {
    const restaurantName = req.params.restaurant;

    const burgerCollection = await burgers();
    const restaurantBurgers = await burgerCollection.find({ restaurant: restaurantName }).toArray();

    if (restaurantBurgers.length === 0)
      return res.status(404).json({ error: "No burgers found for this restaurant" });

    res.json(restaurantBurgers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching burgers by restaurant" });
  }
});

/**
 * @route   PUT /burgers/:id
 * @desc    Update a burger entry
 * @access  Private (Requires authentication)
 */
router.put("/:id", requireAuth(), async (req, res) => {
  // * Good
  try {
    const burgerId = req.params.id;
    if (!ObjectId.isValid(burgerId)) return res.status(400).json({ error: "Invalid burger ID" });

    const { name, restaurant, description, imageUrl } = req.body;
    const updatedFields = {};

    if (name) updatedFields.name = name;
    if (restaurant) updatedFields.restaurant = restaurant;
    if (description) updatedFields.description = description;
    if (imageUrl) updatedFields.imageUrl = imageUrl;

    if (Object.keys(updatedFields).length === 0)
      return res.status(400).json({ error: "No fields pro1vided for update" });

    const burgerCollection = await burgers();
    const updatedBurger = await burgerCollection.findOneAndUpdate(
      { _id: new ObjectId(burgerId) },
      { $set: updatedFields },
      { returnDocument: "after" }
    );

    if (!updatedBurger) return res.status(404).json({ error: "Burger not found" });

    res.json(updatedBurger);
  } catch (error) {
    res.status(500).json({ error: "Error updating burger" });
  }
});

/**
 * @route   DELETE /burgers/:id
 * @desc    Delete a burger entry
 * @access  Private (Requires authentication)
 */
router.delete("/:id", requireAuth(), async (req, res) => {
  try {
    const burgerId = req.params.id;
    if (!ObjectId.isValid(burgerId)) return res.status(400).json({ error: "Invalid burger ID" });

    const burgerCollection = await burgers();
    const deletedBurger = await burgerCollection.findOneAndDelete({ _id: new ObjectId(burgerId) });

    if (!deletedBurger) return res.status(404).json({ error: "Burger not found" });

    res.json({ message: "Burger deleted successfully", burger: deletedBurger });
  } catch (error) {
    res.status(500).json({ error: "Error deleting burger" });
  }
});

export default router;
