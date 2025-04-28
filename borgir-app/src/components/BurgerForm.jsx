import { useState, useEffect } from "react";
import { addReview } from "../api/borgirAPI"; // Import your function
import axios from "axios";
// import { useAuth, useUser, UserButton } from "@clerk/clerk-react"; // Import Clerk's auth hook

const borgirAPI = axios.create({
  baseURL: "http://localhost:3000",
});

export default function BurgerForm() {
  const [newBurger, setNewBurger] = useState({
    name: "",
    restaurant: "",
    description: "",
    imageUrl: "",
  });

  // Create a new review
  const handleCreateBurger = async () => {
    try {
      let token = localStorage.getItem("token");
      const response = await borgirAPI.post("/burgers", newBurger, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token
        },
      });
      alert("Burger created successfully!");
      setNewBurger({
        name: "",
        restaurant: "",
        description: "",
        imageUrl: "",
      });
      document.getElementById("burger_form").close(); // Close the modal
    } catch (error) {
      console.error("Error creating review:", error);
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
      <button className="btn" onClick={() => document.getElementById("burger_form").showModal()}>
        Add New Burger
      </button>

      <dialog className="modal bg-white p-6 rounded-lg w-full" id="burger_form">
        <div className="modal-box">
          <h2 className="text-2xl font-bold">Create New Burger</h2>
          <fieldset className="fieldset">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateBurger();
              }}
            >
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Burger Name"
                  value={newBurger.name}
                  onChange={(e) => setNewBurger({ ...newBurger, name: e.target.value })}
                  className="input bg-white border border-black font-bold text-gray-900"
                  required
                />
              </div>
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Restaurant Name"
                  value={newBurger.restaurant}
                  onChange={(e) => setNewBurger({ ...newBurger, restaurant: e.target.value })}
                  className="input bg-white border border-black font-bold text-gray-900"
                  required
                />
              </div>
              <div className="form-control">
                <textarea
                  placeholder="Description"
                  value={newBurger.description}
                  onChange={(e) => setNewBurger({ ...newBurger, description: e.target.value })}
                  className="input bg-white border border-black font-bold text-gray-900 h-25"
                />
              </div>
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newBurger.imageUrl}
                  onChange={(e) => setNewBurger({ ...newBurger, imageUrl: e.target.value })}
                  className="input bg-white border border-black font-bold text-gray-900"
                />
              </div>
              <button type="submit" className="btn font-bold text-white-900">
                Create Burger
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
