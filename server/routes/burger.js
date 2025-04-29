import express from "express";
import { burgers } from "../configs/mongo/mongoCollections.js";
import { ObjectId } from "mongodb";

const router = express.Router();

/**
 * @route   POST /burgers
 * @desc    Create a new burger entry
 * @access  Private (Requires authentication)
 */
router.post("/", async (req, res) => {
  // * Good
  try {
    // Get the variables from req.body
    const { name, restaurant, description, imageUrl } = req.body;

    // Validate if the name and restaurant are given
    if (!name.trim() || !restaurant.trim()) {
      return res.status(400).json({ error: "Burger name and restaurant are required" });
    }

    // Get Burger Collection
    const burgerCollection = await burgers();
    const existingBurger = await burgerCollection.findOne({ name, restaurant });

    // Validate if the burger
    if (existingBurger) {
      return res.status(400).json({ error: "Burger already exists in this restaurant" });
    }

    // object to insert
    const newBurger = {
      name,
      restaurant,
      description: description || "",
      imageUrl: imageUrl || "",
      createdAt: new Date(),
    };

    // Get just the id from the collection
    const { insertedId } = await burgerCollection.insertOne(newBurger);

    // send the data and the id in object
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
  // Get all the burgers and format them into an array
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
  try {
    // Get the burger id and validate if it exists
    const burgerId = req.params.id;
    if (!ObjectId.isValid(burgerId)) return res.status(400).json({ error: "Invalid burger ID" });

    // Get the collection and find the burger
    const burgerCollection = await burgers();
    const burger = await burgerCollection.findOne({ _id: new ObjectId(burgerId) });

    // Handle if there is no burger
    if (!burger) return res.status(404).json({ error: "Burger not found" });

    // send the burger data
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
  try {
    // Get the restaurant name
    const restaurantName = req.params.restaurant;

    // Get the collection and find the restaurants associated with the burger
    const burgerCollection = await burgers();
    const restaurantBurgers = await burgerCollection.find({ restaurant: restaurantName }).toArray();

    // Handle if there are no restaurants available
    if (restaurantBurgers.length === 0)
      return res.status(404).json({ error: "No burgers found for this restaurant" });

    // Send data of restaurants
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
router.put("/:id", async (req, res) => {
  // * Good
  try {
    // Fetch the id from req.params and validate it
    const burgerId = req.params.id;
    if (!ObjectId.isValid(burgerId)) return res.status(400).json({ error: "Invalid burger ID" });

    // Fetch all the variabless
    const { name, restaurant, description, imageUrl } = req.body;
    const updatedFields = {};

    // Check what is updated
    if (name) updatedFields.name = name;
    if (restaurant) updatedFields.restaurant = restaurant;
    if (description) updatedFields.description = description;
    if (imageUrl) updatedFields.imageUrl = imageUrl;

    // If no fields are provided throw error
    if (Object.keys(updatedFields).length === 0)
      return res.status(400).json({ error: "No fields pro1vided for update" });

    // Fetch collection, and find and update the burger
    const burgerCollection = await burgers();
    const updatedBurger = await burgerCollection.findOneAndUpdate(
      { _id: new ObjectId(burgerId) },
      { $set: updatedFields },
      { returnDocument: "after" }
    );

    // handle if burger is not found
    if (!updatedBurger) return res.status(404).json({ error: "Burger not found" });

    // send burger data
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
router.delete("/:id", async (req, res) => {
  try {
    // params id and validate it
    const burgerId = req.params.id;
    if (!ObjectId.isValid(burgerId)) return res.status(400).json({ error: "Invalid burger ID" });

    // Fetch and delete burger
    const burgerCollection = await burgers();
    const deletedBurger = await burgerCollection.findOneAndDelete({ _id: new ObjectId(burgerId) });

    // If no burger found, handle error
    if (!deletedBurger) return res.status(404).json({ error: "Burger not found" });

    // Send message that burger was deleted
    res.json({ message: "Burger deleted successfully", burger: deletedBurger });
  } catch (error) {
    res.status(500).json({ error: "Error deleting burger" });
  }
});

export default router;
