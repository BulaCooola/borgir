// pages/Login.jsx
import { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      if (res.error) {
        throw res.error;
      }

      if (res.token) {
        localStorage.setItem("token", res.token); // Save the JWT
        window.location.href = "/reviews";
      }
    } catch (err) {
      console.log(err);
      if (err) {
        setError(err); // Capture specific error from the server
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
      console.error("Login Error:", err); // Log the error for debugging
    }
  };
  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-center">Log In</h2>
      {error && <div className="text-red-500">{error}</div>} {/* Show error message if present */}
      <input
        className="border p-2 w-full rounded"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        className="border p-2 w-full rounded"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button className="bg-black text-white px-4 py-2 rounded w-full" type="submit">
        Log In
      </button>
    </form>
  );
}
