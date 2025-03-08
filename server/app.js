import express from "express";
import http from "http";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import configRoutes from "./routes/index.js";

// Auth
import { clerkMiddleware, requireAuth } from "@clerk/express";

import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Express configs
app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

configRoutes(app);
app.use(clerkMiddleware()); // Clerk

// Use `getAuth()` to protect a route based on authorization status
const hasPermission = (req, res, next) => {
  const auth = getAuth(req);

  // Handle if the user is not authorized
  if (!auth.has({ permission: "org:admin:example" })) {
    return res.status(403).send("Forbidden");
  }

  return next();
};

app.get("/path", requireAuth(), hasPermission, (req, res) => res.json(req.auth));

app.listen(3000, () => {
  console.log(`Server listening at http://localhost:3000`);
});
