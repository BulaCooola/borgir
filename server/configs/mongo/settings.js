import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/";

export const mongoConfig = {
  serverUrl: MONGO_URI,
  database: "Borgir",
};

// This can change depending if we are using a Mongo Atlas for cloud database
