import reviewRoutes from "./reviews.js";
import burgerRoutes from "./burger.js";
import authRoutes from "./auth.js";
import usersMethods from "../data/users.js";
import reviewMethods from "../data/reviews.js";
import authMiddleware from "../middleware/auth.js";

const constructorMethod = (app) => {
  // Routes
  app.get("/", (req, res) => {
    res.status(200).json({ message: "Connected to the API" });
  });
  app.use("/auth", authRoutes);
  app.use("/reviews", reviewRoutes);
  app.use("/burgers", burgerRoutes);

  /**
   * @route   GET /reviews/restaurant/
   * @desc    Get lists of restaurants
   * @access  Public
   */
  app.get("/restaurant", async (req, res) => {
    try {
      // Get each review by restaurant
      const restaurants = await reviewMethods.getAllRestaurantNames();
      res.json(restaurants);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

  /**
   * @route   GET /reviews/user
   * @desc    Get all reviews by a user
   * @access  Public
   */
  app.get("/user", authMiddleware, async (req, res) => {
    try {
      const userId = req.user.id;
      // Get each review by userId
      const reviews = await reviewMethods.getReviewsByUserId(userId);
      console.log(reviews);
      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: error.message });
    }
  });

  app.post("/newUser", async (req, res) => {
    const exists = await usersMethods.userExists(req.body.id);
    if (!exists) {
      await usersMethods.createUser(
        req.body.id,
        req.body.email,
        req.body.username,
        req.body.firstName,
        req.body.lastName,
        req.body.profilePictures
      );
    }
    res.status(200).send();
  });

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

export default constructorMethod;
