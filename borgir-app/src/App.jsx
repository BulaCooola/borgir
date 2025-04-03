import { useState } from "react";
import { SignIn, SignUp, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Routes, Route } from "react-router-dom";

// import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/Home";
// import Login from "./pages/Login";
import ForumList from "./pages/ForumList";
import ReviewList from "./pages/ReviewList";
import NavigationBar from "./components/NavigationBar.jsx";
import "./App.css";

function App() {
  return (
    <div>
      <NavigationBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forum" element={<ForumList />} />
        <Route path="/reviews" element={<ReviewList />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/forum/:id" element={<ForumPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;
