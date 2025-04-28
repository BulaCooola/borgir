import { useState } from "react";
import axios from "axios";

const borgirAPI = axios.create({
  baseURL: "http://localhost:3000",
});

export default function UserModal({ userId, username }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userReviews, setUserReviews] = useState(null);
  const [loading, setLoading] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    fetchUserData();
  };
  const closeModal = () => setIsOpen(false);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      const response = await borgirAPI.get(`/reviews/user/${userId}`); // Adjust this endpoint as needed

      setUserReviews(response.data);
    } catch (error) {
      console.error(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Clickable Username */}
      <p
        className="text-sm text-gray-500 cursor-pointer hover:underline inline-block"
        onClick={openModal}
      >
        Posted by {username}
      </p>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={closeModal}
            >
              ✖
            </button>

            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : userReviews ? (
              <>
                <h2 className="text-xl font-bold text-black mb-2">@{username}</h2>

                <h3 className="font-semibold text-black mb-2">Reviews:</h3>

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
              <p className="text-gray-600">User not found.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
