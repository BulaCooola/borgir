import { useState } from "react";
import { addReview } from "../api/borgirAPI"; // Import your function
import { useAuth, useUser, UserButton } from "@clerk/clerk-react"; // Import Clerk's auth hook

export default function ReviewForm() {
  const [newTopic, setNewTopic] = useState({ title: "", description: "" });
  // const [showReplies, setShowReplies] = useState({}); // Track visibility of replies

  const { getToken } = useAuth(); // Get Clerk token
  const { isSignedIn, user } = useUser();

  const review = {
    userId: user.id,
    burgerId: "67ccd7b57fdb9c9b206525ce",
    restaurantName: "Ronald McDonald's",
    rating: 5,
    comment: "Great burgers!",
    imageUrl: "https://example.com/burger.jpg",
  };

  const handleSubmit = async () => {
    try {
      const token = await getToken(); // Fetch the JWT token
      await addReview({ ...review, token }); // Pass token into API
      alert("Review added successfully!");
    } catch (error) {
      console.error("Failed to add review:", error);
    }
  };

  // ! Change the input tags to match what is needed for a review
  // You might want to make a separate page for just making reviews
  return (
    <>
      {isSignedIn ? (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
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
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
