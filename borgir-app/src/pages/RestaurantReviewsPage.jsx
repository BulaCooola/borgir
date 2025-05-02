import React, { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";

const borgirAPI = axios.create({
  baseURL: "http://localhost:3000",
});

const RestaurantReviewsPage = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [averageRating, setAverageRating] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    data: burgers,
    error: burgersError,
    isLoading: burgersLoading,
  } = useSWR("/burgers", async (url) => {
    const res = await borgirAPI.get("/burgers");
    return res.data; // assuming it returns an array of burgers [{id, name, restaurant}]
  });

  // Fetches all the restaurant names
  useEffect(() => {
    const fetchRestaurantNames = async () => {
      try {
        const response = await borgirAPI.get("/restaurant");
        setAllRestaurants(response.data); // Save names into state
        setFilteredRestaurants(response.data); // Initialize the filtered list too
      } catch (err) {
        console.error("Error fetching restaurant names:", err);
      }
    };

    fetchRestaurantNames();
  }, []);

  // Filters the search bar text
  useEffect(() => {
    if (restaurantName.trim() === "") {
      setFilteredRestaurants(allRestaurants);
    } else {
      const filtered = allRestaurants.filter((name) =>
        name.toLowerCase().includes(restaurantName.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    }
  }, [restaurantName, allRestaurants]);

  // Select feature
  const handleSelect = (name) => {
    setRestaurantName(name);
    setSelectedRestaurant(name);
    setFilteredRestaurants([]);
  };

  const findBurgerById = (id) => {
    if (!burgers) return null;
    return burgers.find((burger) => burger._id === id);
  };

  const handleSearch = async () => {
    if (!selectedRestaurant.trim()) {
      setError("Please select a restaurant.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await borgirAPI.get(`/reviews/restaurant/${selectedRestaurant.trim()}`);
      setReviews(response.data);
      const reviewData = response.data;

      // Calculate average rating
      if (reviewData.length > 0) {
        const total = reviewData.reduce((sum, r) => sum + r.rating, 0);
        const avg = total / reviewData.length;
        setAverageRating(avg.toFixed(1)); // round to 1 decimal
      } else {
        setAverageRating(null);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error fetching reviews.");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Search Burger Reviews by Restaurant</h1>

      <div className="relative mb-4">
        <input
          type="text"
          className="border p-2 w-full rounded"
          placeholder="Type restaurant name..."
          value={restaurantName}
          onChange={(e) => {
            setRestaurantName(e.target.value);
            setSelectedRestaurant("");
          }}
        />

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full"
        >
          Search Reviews
        </button>

        {filteredRestaurants.length > 0 && restaurantName.trim() && (
          <ul className="absolute bg-white border w-full rounded shadow mt-1 z-10 max-h-60 overflow-auto">
            {filteredRestaurants.map((name, idx) => (
              <li
                key={idx}
                className="p-2 hover:bg-gray-200 cursor-pointer text-black"
                onClick={() => handleSelect(name)}
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading && <p className="mt-4">Loading reviews...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-4">
        {reviews.length > 0 && !loading ? (
          <div className="py-4">
            <h2 className="text-2xl p-4">{reviews.length} reviews</h2>
            {averageRating && (
              <p className="text-lg font-semibold mt-2">Average Rating: ⭐ {averageRating}/10</p>
            )}
            <div>
              {reviews.map((review, index) => {
                const burger = findBurgerById(review.burgerId);

                return (
                  <ul className="space-y-4">
                    <li key={index} className="border p-4 my-4 rounded shadow">
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-400 text-lg">⭐</span>
                        <span className="ml-1 font-medium">{review.rating} / 10</span>
                        <span>
                          {" "}
                          <h1 className="ml-5 px-7 text-2xl text-white-700">
                            🍔{" "}
                            {burger ? `${burger.name} from ${burger.restaurant}` : "Unknown Burger"}
                          </h1>
                        </span>
                      </div>
                      <h2 className="text-lg text-blue-400 font-semibold">
                        {"@" + review.username || "Anonymous"}
                      </h2>
                      <p className="mt-2">{review.comment}</p>
                    </li>
                  </ul>
                );
              })}
            </div>
          </div>
        ) : (
          !loading && !error && <p>No reviews found.</p>
        )}
      </div>
    </div>
  );
};

export default RestaurantReviewsPage;
