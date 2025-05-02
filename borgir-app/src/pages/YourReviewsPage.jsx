import { useState } from "react";
import axios from "axios";

const borgirAPI = axios.create({
  baseURL: "http://localhost:3000",
});

export default function YourReviewsPage() {
  const [userReviews, setUserReviews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(null);

  const fetchUserData = async () => {
    setAverageRating(null);

    try {
      let token = localStorage.getItem("token");
      setLoading(true);
      const response = await borgirAPI.get(`/user`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token
        },
      }); // Adjust this endpoint as needed

      setUserReviews(response.data);
      let reviewData = response.data;

      // Calculate average rating
      if (reviewData.length > 0) {
        const total = reviewData.reduce((sum, r) => sum + r.rating, 0);
        const avg = total / reviewData.length;
        setAverageRating(avg.toFixed(1)); // round to 1 decimal
      } else {
        setAverageRating(null);
      }
    } catch (error) {
      console.error(error);
      setUserReviews(null);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Clickable Username */}
      <div className="my-4">
        <p
          className="btn btn-primary text-sm font-bold text-black-500 cursor-pointer hover:underline inline-block"
          onClick={() => {
            fetchUserData();
          }}
        >
          View Your Reviews
        </p>
      </div>

      <div className="">
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : userReviews ? (
          <>
            <h2 className="text-xl font-bold text-white mb-2">@{userReviews[0].username}</h2>

            {averageRating && (
              <p className="text-lg font-semibold mt-2">Average Rating: ⭐ {averageRating}/10</p>
            )}
            <h3 className="font-semibold text-white mb-2">Reviews:</h3>

            <ul className="list-none list-inside space-y-1">
              {userReviews && userReviews.length > 0 ? (
                userReviews.map((review, idx) => (
                  <div className="card card-border bg-base-300 w-96">
                    <div className="card-body">
                      <li key={idx} className="text-gray-600">
                        <h2 className="card-title text-white">
                          🍔 {review.restaurantName}: ⭐{review.rating}/10
                        </h2>
                        <p className="text-xs text-white">
                          {new Date(review.createdAt).toLocaleString()}
                        </p>
                        <p className="text-md text-white">"{review.comment}"</p>
                      </li>
                    </div>
                  </div>
                ))
              ) : (
                <li className="text-gray-500 italic">No reviews available.</li>
              )}
            </ul>
          </>
        ) : (
          error && <p className="text-red-500 italic">You have no reviews!</p>
          //   <p className="text-gray-600">User not found.</p>
        )}
        {/* {error && <p className="text-red-500 italic">No reviews!</p>} */}
      </div>
    </>
  );
}
