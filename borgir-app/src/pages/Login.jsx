// pages/Login.jsx
import { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });

      localStorage.setItem("token", res.token); // Save the JWT
      navigate("/"); // Redirect to homepage or dashboard
    } catch (err) {
      alert("Authentication failed");
      console.error(err);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-center">Log In</h2>
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
