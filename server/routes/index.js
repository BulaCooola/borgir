import reviewRoutes from "./reviews.js";
import burgerRoutes from "./burger.js";

const constructorMethod = (app) => {
  // Routes
  app.get("/", (req, res) => {
    res.send("home");
  });
  app.use("/reviews", reviewRoutes);
  app.use("/burgers", burgerRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

export default constructorMethod;
