import axios from "axios";

const borgirAPI = axios.create({
  baseURL: "http://localhost:3000",
});

export const reviewURLEndpoint = "/reviews";

export const getReviews = async () => {
  const response = await borgirAPI.get(reviewURLEndpoint);
  return response.data;
};

export const addReview = async ({
  burgerId,
  restaurantName,
  rating,
  comment,
  imageURL,
  userId,
  token,
}) => {
  try {
    const response = await borgirAPI.post(
      reviewURLEndpoint,
      { burgerId, restaurantName, rating, comment, imageURL, userId }, // Request Body
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding review:", error.response?.data || error.message);
    throw error;
  }
};
