import reviewRoutes from "./reviews.js";
import burgerRoutes from "./burger.js";
import usersMethods from "../data/users.js";

const constructorMethod = (app) => {
  // Routes
  app.get("/", (req, res) => {
    res.status(200).json({ message: "Connected to the API" });
  });
  app.use("/reviews", reviewRoutes);
  app.use("/burgers", burgerRoutes);

  app.post("/newUser", async (req, res) => {
    const exists = await usersMethods.userExists(req.body.id);
    console.log(exists);
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
