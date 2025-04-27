import { useState } from "react";
import { SignIn, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Routes, Route } from "react-router-dom";

// import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp.jsx";
import ForumList from "./pages/ForumList";
import ReviewList from "./pages/ReviewList";
import NavigationBar from "./components/NavigationBar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import "./App.css";

function App() {
  const isLoggedIn = () => {
    return !!localStorage.getItem("token");
  };

  return (
    <div>
      <NavigationBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/forum"
          element={
            <PrivateRoute>
              <ForumList />
            </PrivateRoute>
          }
        />
        <Route
          path="/reviews"
          element={
            <PrivateRoute>
              <ReviewList />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/forum/:id" element={<ForumPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;
