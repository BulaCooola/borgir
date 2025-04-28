import React, { useState, useEffect } from "react";
import axios from "axios";

const borgirAPI = axios.create({
  baseURL: "http://localhost:3000",
});

const RestaurantReviewsPage = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");

  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSearch = async () => {
    if (!selectedRestaurant.trim()) {
      setError("Please select a restaurant.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await borgirAPI.get(`/reviews/restaurant/${selectedRestaurant.trim()}`);
      console.log(response.data);
      setReviews(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error fetching reviews.");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Restaurant Reviews</h1>

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
          <div>
            <h2 className="text-2xl p-4">{reviews.length} reviews</h2>
            {reviews.map((review, index) => (
              <ul className="space-y-4">
                <li key={index} className="border p-4 rounded shadow">
                  <h2 className="text-lg font-semibold">{review.reviewer || "Anonymous"}</h2>
                  <p>Rating: {review.rating}/5</p>
                  <p className="mt-2">{review.comment}</p>
                </li>
              </ul>
            ))}
          </div>
        ) : (
          !loading && !error && <p>No reviews found.</p>
        )}
      </div>
    </div>
  );
};

export default RestaurantReviewsPage;
