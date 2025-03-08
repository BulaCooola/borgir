// These will contain functions that compliment a single review. These will be comments (maybe upvotes)
// This will be everything review related. Creating, deleting, updating, and getting reviews.
import { ObjectId } from "mongodb";
import { reviews } from "../config/mongo/mongoCollections.js";
import { users } from "../configs/mongo/mongoCollections.js";

const exportedMethods = {
  /**
   * Adds a comment to a review.
   * @param {string} reviewId - The ID of the review to comment on.
   * @param {string} userId - The ID of the user making the comment.
   * @param {string} comment - The comment text.
   * @returns {Promise<Object>} - The updated review object.
   * @throws {Error} - If input validation fails or the database operation fails.
   */
  async addComment(reviewId, userId, comment) {
    // Validation Data
    if (!ObjectId.isValid(reviewId)) throw new Error("Invalid review ID.");
    if (!ObjectId.isValid(userId)) throw new Error("Invalid user ID.");
    if (typeof comment !== "string" || comment.trim().length === 0)
      throw new Error("Invalid comment.");

    // Fetch review collection and review
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({ _id: new ObjectId(reviewId) });

    if (!review) throw new Error("Review not found.");

    // Create object for the comment
    const newComment = {
      userId: new ObjectId(userId),
      comment,
      createdAt: new Date(),
    };

    // Add comment to the review's comments array
    const updatedReview = await reviewCollection.updateOne(
      { _id: new ObjectId(reviewId) },
      { $push: { comments: newComment } }
    );

    if (!updatedReview.modifiedCount) throw new Error("Failed to add comment.");

    return newComment;
  },

  /**
   * Retrieves all comments for a given review.
   * @param {string} reviewId - The ID of the review.
   * @returns {Promise<Array>} - An array of comment objects.
   * @throws {Error} - If the review is not found or ID is invalid.
   */
  async getComments(reviewId) {
    // Validate Data
    if (!ObjectId.isValid(reviewId)) throw new Error("Invalid review ID.");

    // Fetch Collection and get the commments
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne(
      { _id: new ObjectId(reviewId) },
      { projection: { comments: 1 } }
    );

    if (!review) throw new Error("Review not found.");

    return review.comments || [];
  },
};
