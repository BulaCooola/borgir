// Importing Packages
import express from "express";

// Importing Methods
import reviewMethods from "../data/reviews.js";

// Import Middleware
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/**
 * @route   GET /reviews
 * @desc    Get paginated reviews
 * @access  Public
 */
router.get("/", authMiddleware, async (req, res) => {
  // Set up the get reviews such that it is paginated and limited
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 50;
    const reviews = await reviewMethods.getReviews(offset, limit);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /reviews
 * @desc    Create a new review
 * @access  Public
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Get userId from the authMiddleware
    const userId = req.user.id;
    // console.log("UserId", userId);
    // console.log(req.body);

    // Get necessary parameters to make review
    const { burgerId, restaurantName, rating, comment, imageUrl } = req.body;

    // Throw error if parameters don't exist
    if (!burgerId || !userId || !restaurantName || !rating || !comment) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Call database function to create the review
    const newReview = await reviewMethods.createReview(
      userId,
      burgerId,
      restaurantName,
      rating,
      comment,
      imageUrl
    );

    // Send new review
    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /reviews/:reviewId
 * @desc    Get a single review by review ID
 * @access  Public
 */
router.get("/:reviewId", async (req, res) => {
  try {
    // Retrieve the review and send it
    const review = await reviewMethods.getReviewById(req.params.reviewId);
    res.status(200).json(review);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @route   GET /reviews/restaurant/:restaurantName
 * @desc    Get reviews by restaurant name
 * @access  Public
 */
router.get("/restaurant/:restaurantName", async (req, res) => {
  try {
    // Get each review by restaurant
    const reviews = await reviewMethods.getReviewsByRestaurant(req.params.restaurantName);
    res.json(reviews);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @route   GET /reviews/user/:userId
 * @desc    Get all reviews by a user
 * @access  Public
 */
router.get("/user/:userId", async (req, res) => {
  try {
    // Get each review by userId
    const reviews = await reviewMethods.getReviewsByUserId(req.params.userId);
    res.json(reviews);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @route   DELETE /reviews/:reviewId
 * @desc    Delete a review
 * @access  Public
 */
router.delete("/:reviewId", async (req, res) => {
  try {
    // Call function to delete the wanted review
    const result = await reviewMethods.deleteReview(req.params.reviewId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   PUT /reviews/:reviewId
 * @desc    Update a review
 * @access  Public
 */
router.put("/:reviewId", async (req, res) => {
  try {
    // Retrieve new fields and update the review
    const updatedFields = req.body;
    const updatedReview = await reviewMethods.updateReview(req.params.reviewId, updatedFields);
    res.json(updatedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
