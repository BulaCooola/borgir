import { useState, useEffect } from "react";
import { addReview } from "../api/borgirAPI"; // Import your function
import axios from "axios";
// import { useAuth, useUser, UserButton } from "@clerk/clerk-react"; // Import Clerk's auth hook

const borgirAPI = axios.create({
  baseURL: "http://localhost:3000",
});

export default function ReviewForm() {
  const [burgers, setBurgers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    burgerId: "",
    restaurantName: "",
    rating: "",
    comment: "",
    imageUrl: "",
  });
  const [editingReview, setEditingReview] = useState(null);

  // Fetch burger list from server when the component loads
  useEffect(() => {
    const fetchBurgers = async () => {
      try {
        const response = await borgirAPI.get("/burgers"); // Make sure your API endpoint is correct
        setBurgers(response.data);
      } catch (error) {
        console.error("Error fetching burgers", error);
      }
    };

    fetchBurgers();
  }, []);

  // Create a new review
  const handleCreateReview = async () => {
    try {
      let token = localStorage.getItem("token");
      const response = await borgirAPI.post("http://localhost:3000/reviews", newReview, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token
        },
      });
      setReviews([...reviews, response.data]); // Add the new review to the list
      setNewReview({
        burgerId: "",
        restaurantName: "",
        rating: "",
        comment: "",
        imageUrl: "",
      });
      document.getElementById("create_form").close(); // Close the modal
    } catch (error) {
      console.error("Error creating review:", error);
    }
  };

  // Delete a review
  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      });
      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  // Edit a review
  const handleEditReview = (review) => {
    setEditingReview(review);
    setNewReview({
      burgerId: review.burgerId,
      restaurantName: review.restaurantName,
      rating: review.rating,
      comment: review.comment,
      imageUrl: review.imageUrl,
    });
  };

  // Update the review
  const handleUpdateReview = async () => {
    try {
      const response = await axios.put(`/reviews/${editingReview._id}`, newReview, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      });
      setReviews(
        reviews.map((review) => (review._id === editingReview._id ? response.data : review))
      );
      setEditingReview(null);
      setNewReview({
        burgerId: "",
        restaurantName: "",
        rating: "",
        comment: "",
        imageUrl: "",
      });
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      // const token = await getToken(); // Fetch the JWT token
      // await addReview({ ...review, token }); // Pass token into API
      alert("Review added successfully!");
    } catch (error) {
      console.error("Failed to add review:", error);
    }
  };

  // ! Change the input tags to match what is needed for a review
  // You might want to make a separate page for just making reviews
  return (
    <>
      {/* Create or Edit Review Form */}
      <button className="btn" onClick={() => document.getElementById("create_form").showModal()}>
        Create Review
      </button>

      <dialog className="modal bg-white p-6 rounded-lg w-full" id="create_form">
        <div className="modal-box">
          <h2 className="text-2xl font-bold">
            {editingReview ? "Edit Review" : "Create New Review"}
          </h2>
          <fieldset className="fieldset">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                editingReview ? handleUpdateReview() : handleCreateReview();
              }}
            >
              <div className="form-control">
                <label htmlFor="burgerId" className="block text-lg font-medium text-gray-700">
                  Select Burger
                </label>
                <select
                  id="burgerId"
                  value={newReview.burgerId}
                  onChange={(e) => {
                    const selectedBurgerId = e.target.value;
                    const selectedBurger = burgers.find((b) => b._id === selectedBurgerId);
                    setNewReview({
                      ...newReview,
                      burgerId: selectedBurgerId,
                      restaurantName: selectedBurger.restaurant,
                    });
                  }}
                  className="mt-2 block w-full p-2 border rounded-md bg-gray-50 text-black"
                  required
                >
                  <option value="">-- Select a Burger --</option>
                  {Array.isArray(burgers) && burgers.length > 0 ? (
                    burgers.map((burger) => (
                      <option key={burger._id} value={burger._id}>
                        {burger.name} - {burger.restaurant}
                      </option>
                    ))
                  ) : (
                    <option disabled>No burgers available</option>
                  )}
                </select>
              </div>
              <div className="form-control">
                <input
                  type="number"
                  placeholder="Rating"
                  value={newReview.rating}
                  onChange={(e) => {
                    // Ensure the input value is within 1 and 10
                    const value = Math.max(1, Math.min(10, e.target.value));
                    setNewReview({ ...newReview, rating: value });
                  }}
                  min="1"
                  max="10"
                  step="1"
                  className="input bg-white border border-black font-bold text-gray-900"
                />
              </div>
              <div className="form-control">
                <textarea
                  placeholder="Comment"
                  value={newReview.comment}
                  className="input bg-white border border-black font-bold text-gray-900 h-25"
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                />
              </div>
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newReview.imageUrl}
                  className="input bg-white border border-black font-bold text-gray-900"
                  onChange={(e) => setNewReview({ ...newReview, imageUrl: e.target.value })}
                />
              </div>
              <button type="submit" className="btn font-bold text-white-900">
                {editingReview ? "Update Review" : "Create Review"}
              </button>
            </form>
          </fieldset>
        </div>
        {/* To click outside to close */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Start a Discussion</h2>
        <input
          className="w-full p-2 border rounded-md text-gray-600 mb-2"
          placeholder="Topic Title"
          value={newTopic.title}
          onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
        />
        <textarea
          className="w-full p-2 border rounded-md text-gray-600"
          rows="3"
          placeholder="Write a description..."
          value={newTopic.description}
          onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
        />
        <button className="text-gray-900" onClick={handleSubmit}>
          Submit Review
        </button>
      </div> */}
    </>
  );
}
