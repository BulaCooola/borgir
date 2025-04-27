import axios from "axios";

const borgirAPI = axios.create({
  baseURL: "http://localhost:3000",
});

export const reviewURLEndpoint = "/reviews";

export const getReviews = async () => {
  let token = localStorage.getItem("token");
  const response = await borgirAPI.get("http://localhost:3000/reviews", {
    headers: {
      Authorization: `Bearer ${token}`, // Pass the token
    },
  });
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
