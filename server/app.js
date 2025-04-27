import express from "express";
// import http from "http";
import cors from "cors";
// import path from "path";
import bodyParser from "body-parser";
// import { fileURLToPath } from "url";
import configRoutes from "./routes/index.js";

import { errorHandler } from "./middleware/errorHandler.js";

// Auth
// import { clerkMiddleware, requireAuth } from "@clerk/express";

import dotenv from "dotenv";
dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();

// Express configs
app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

configRoutes(app);

app.use(errorHandler); // plug it in last

const server = app.listen(3000, () => {
  console.log(`Server listening at http://localhost:3000`);
});

export { app, server };
