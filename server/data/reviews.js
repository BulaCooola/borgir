// This will be everything review related. Creating, deleting, updating, and getting reviews.
import { ObjectId } from "mongodb";
import { reviews } from "../configs/mongo/mongoCollections.js";
import { users } from "../configs/mongo/mongoCollections.js";
import { burgers } from "../configs/mongo/mongoCollections.js";

const exportedMethods = {
  /**
   * Creates Review of a burger.
   * @param  {String} userId    User ID --> turns into ObjectId
   * @param  {String} burgerId  ID identifying the burger --> turns into ObjectId
   * @param  {Number} rating    Rating of the burger
   * @param  {String} comment   Review description of the burger
   * @return {Object}           Return object containing reviewId
   */
  async createReview(userId, burgerId, restaurantName, rating, comment, imageUrl) {
    if (
      !userId ||
      !burgerId ||
      !restaurantName ||
      typeof rating !== "number" ||
      rating < 1 ||
      rating > 5 ||
      !comment
    ) {
      throw new Error("Invalid input data for review.");
    }

    const reviewCollection = await reviews();
    console.log("hi");
    const newReview = {
      userId: userId,
      burgerId: new ObjectId(burgerId),
      restaurantName: restaurantName,
      rating,
      comment,
      imageUrl,
      replies: [],
      createdAt: new Date(),
    };

    const insertInfo = await reviewCollection.insertOne(newReview);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw new Error("Could not add review.");
    }

    return { _id: insertInfo.insertedId, ...newReview };
  },

  /**
   * Updates existing review of a burger.
   * @param {string} reviewId - Review ID.
   * @param {Object} updatedFields - Object containing new comment, rating, optional image.
   * @returns {Promise<Object>} - The updated review object.
   * @throws {Error} - If the reviewId is invalid or the update fails.
   */
  async updateReview(reviewId, updatedFields) {
    //   Might need to change the updatedfields and check if the fields exist.
    if (!ObjectId.isValid(reviewId)) throw new Error("Invalid review ID.");
    if (typeof updatedFields !== "object" || Object.keys(updatedFields).length === 0) {
      throw new Error("Invalid or empty update fields.");
    }

    const reviewCollection = await reviews();
    const updateResult = await reviewCollection.findOneAndUpdate(
      { _id: new ObjectId(reviewId) },
      { $set: updatedFields },
      { returnDocument: "after" }
    );

    if (!updateResult) throw new Error("Review update failed or review not found.");
    return updateResult;
  },

  /**
   * Creates Review of a burger.
   * @param  {String} reviewId  Review Id of the review
   * @returns {Promise<Object>} - The review object.
   * @throws {Error} - If the ID is invalid or the review is not found.
   */
  async getReviewById(reviewId) {
    if (!ObjectId.isValid(reviewId)) throw new Error("Invalid review ID.");

    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({ _id: new ObjectId(reviewId) });

    if (!review) throw new Error("Review not found.");
    return review;
  },

  // /**
  //  * Gets burger review by burgerId.
  //  * @param  {String} burgerId  Burger ID of a single burger
  //  * @returns {Promise<Array>} - An array of review objects for the burger.
  //  * @throws {Error} - If the ID is invalid or no reviews are found.
  //  */
  // async getReviewsByBurgerId(burgerId) {
  //   if (!ObjectId.isValid(burgerId)) throw new Error("Invalid burger ID.");

  //   const reviewCollection = await reviews();
  //   const burgerReviews = await reviewCollection
  //     .find({ burgerId: new ObjectId(burgerId) })
  //     .toArray();

  //   if (!burgerReviews.length) throw new Error("No reviews found for this burger.");
  //   return burgerReviews;
  // },

  /**
   * Gets burger review by restaurant name.
   * @param  {String} restaurantName  Burger ID of a single burger
   * @returns {Promise<Array>} - An array of review objects.
   * @throws {Error} - If no reviews are found for the restaurant.
   */
  async getReviewsByRestaurant(restaurantName) {
    if (typeof restaurantName !== "string" || restaurantName.trim().length === 0) {
      throw new Error("Invalid restaurant name.");
    }

    const reviewCollection = await reviews();
    const restaurantReviews = await reviewCollection
      .find({ restaurantName: restaurantName.trim() })
      .toArray();

    if (!restaurantReviews.length) throw new Error("No reviews found for this restaurant.");
    return restaurantReviews;
  },

  /**
   * Gets reviews containing the burger and restaurant name
   * @param  {String} burgerName        Burger Name
   * @param  {String} restaurantName    Restaurant Name of the burger
   * @return {String}           Properly formatted initials.
   */
  async getReviewsForBurger(burgerName, restaurantName) {
    const burgerCollection = await burgers();
    const reviewCollection = await reviews();

    // Find the burger ID
    const burger = await burgerCollection.findOne({
      burgerName: burgerName.toLowerCase(),
      restaurantName: restaurantName.toLowerCase(),
    });

    if (!burger) throw new Error("Burger not found.");

    // Fetch all reviews with the same burgerId
    return await reviewCollection.find({ burgerId: burger._id }).toArray();
  },

  /**
   * Get all the Reviews from a single restaurant / chain
   * @param  {String} userId    User ID --> turns into ObjectId
   * @return {Promise<Array>}   Array of reviews made by single user
   * @throws {Error} - If the userId is invalid or no reviews are found.
   */
  async getReviewsByUserId(userId) {
    if (!ObjectId.isValid(userId)) throw new Error("Invalid user ID.");

    const reviewCollection = await reviews();
    const userReviews = await reviewCollection.find({ userId: new ObjectId(userId) }).toArray();

    if (!userReviews.length) throw new Error("No reviews found for this user.");
    return userReviews;
  },

  /**
   * Fetches a paginated list of reviews, retrieving a limited number at a time.
   *
   * @param  {number} offset - The number of reviews to skip (for pagination).
   * @param  {number} [limit=50] - The number of reviews to fetch (default is 50).
   * @returns {Promise<Array>} - An array of review objects.
   * @throws {Error} - Throws an error if offset or limit are invalid.
   */
  async getReviews(offset, limit = 50) {
    // prolly get a few reviews at a time so it doesn't get ALL reviews 🗿
    if (typeof offset !== "number" || offset < 0) throw new Error("Invalid offset value.");
    if (typeof limit !== "number" || limit <= 0) throw new Error("Invalid limit value.");

    const reviewCollection = await reviews();
    const theReviews = await reviewCollection.find().skip(offset).limit(limit).toArray();
    return theReviews;
  },

  /**
   * Deletes a review by review ID
   * @param  {String} reviewID  ID of the review
   * @return {Promise<Object>}  Acknowledgement Object
   * @throws {Error} - If the reviewId is invalid or the deletion fails.
   */
  async deleteReview(reviewId) {
    if (!ObjectId.isValid(reviewId)) throw new Error("Invalid review ID.");

    const reviewCollection = await reviews();
    const deletionResult = await reviewCollection.deleteOne({ _id: new ObjectId(reviewId) });

    if (deletionResult.deletedCount === 0) throw new Error("Review not found or already deleted.");
    return { success: true, message: "Review deleted successfully." };
  },
};

export default exportedMethods;
