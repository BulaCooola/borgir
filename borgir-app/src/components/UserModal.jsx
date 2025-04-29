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
    document.body.style.overflow = "hidden"; // 🚫 disable scroll
    fetchUserData();
  };
  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto"; // ✅ enable scroll again
  };

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
      <p className="text-sm text-gray-500">Posted by</p>
      <p
        className="text-sm font-bold text-blue-500 cursor-pointer hover:underline inline-block"
        onClick={() => {
          fetchUserData();
          document.getElementById("my_modal_3").showModal();
        }}
      >
        @{username}
      </p>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : userReviews ? (
            <>
              <h2 className="text-xl font-bold text-white mb-2">@{username}</h2>

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
            <p className="text-gray-600">User not found.</p>
          )}
        </div>
      </dialog>
    </>
  );
}
