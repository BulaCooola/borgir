import { MongoClient } from "mongodb";
import { mongoConfig } from "./settings.js";

let _connection = undefined;
let _db = undefined;

export const dbConnection = async () => {
  if (!_connection) {
    console.log(mongoConfig.serverUrl);
    _connection = await MongoClient.connect(mongoConfig.serverUrl);
    console.log("Connected to Database");
    _db = _connection.db(mongoConfig.database);
  }

  return _db;
};

export const closeConnection = async () => {
  await _connection.close();
};
