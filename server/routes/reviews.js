// Importing Packages
import express from "express";
import { requireAuth } from "@clerk/express";

// Importing Methods
import reviewMethods from "../data/reviews.js";

const router = express.Router();

/**
 * @route   GET /reviews
 * @desc    Get paginated reviews
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 50;

    const reviews = await reviewMethods.getReviews(offset, limit);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /reviews
 * @desc    Create a new review
 * @access  Public
 */
router.post("/", requireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { burgerId, restaurantName, rating, comment, imageUrl } = req.body;

    if (!burgerId || !userId || !restaurantName || !rating || !comment) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const newReview = await reviewMethods.createReview({
      burgerId,
      userId,
      restaurantName,
      rating,
      comment,
      imageUrl,
    });

    res.status(201).json(newReview);
  } catch (error) {
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
    const review = await reviewMethods.getReviewById(req.params.reviewId);
    res.json(review);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * @route   GET /reviews/burger/:burgerId
 * @desc    Get reviews for a specific burger
 * @access  Public
 */
router.get("/burger/:burgerId", async (req, res) => {
  try {
    const reviews = await reviewMethods.getReviewsByBurgerId(req.params.burgerId);
    res.json(reviews);
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
router.delete("/:reviewId", requireAuth(), async (req, res) => {
  try {
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
router.put("/:reviewId", requireAuth(), async (req, res) => {
  try {
    const updatedFields = req.body;
    const updatedReview = await reviewMethods.updateReview(req.params.reviewId, updatedFields);
    res.json(updatedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
