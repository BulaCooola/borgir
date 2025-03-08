import { dbConnection } from "./mongoConnections.js";

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

export const reviews = getCollectionFn("reviews");
export const users = getCollectionFn("users");
export const burgers = getCollectionFn("burgers");
