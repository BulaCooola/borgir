import { useState } from "react";
import { SignIn, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Routes, Route } from "react-router-dom";

// import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp.jsx";
import ReviewPage from "./pages/ReviewPage.jsx";
import RestaurantReviewsPage from "./pages/RestaurantReviewsPage.jsx";
import YourReviewsPage from "./pages/YourReviewsPage.jsx";

import NavigationBar from "./components/NavigationBar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import DevOpsDashboard from "./pages/DevOpsDashboard.jsx";
import "./App.css";

function App() {
  const isLoggedIn = () => {
    return !!localStorage.getItem("token");
  };

  return (
    <div>
      <NavigationBar />

      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route
          path="/reviews"
          element={
            <PrivateRoute>
              <ReviewPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant-reviews"
          element={
            <PrivateRoute>
              <RestaurantReviewsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/your-reviews"
          element={
            <PrivateRoute>
              <YourReviewsPage />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />

        <Route path="/dashboard" element={<DevOpsDashboard />} />
        {/* <Route path="/forum/:id" element={<ForumPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;
