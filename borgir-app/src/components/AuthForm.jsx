import { useState } from "react";
import { signupUser, loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function AuthForm({ type }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fn = type === "login" ? loginUser : signupUser;
      const res = await fn({ email, password });

      localStorage.setItem("token", res.token); // Save the JWT
      navigate("/"); // Redirect to homepage or dashboard
    } catch (err) {
      alert("Authentication failed");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-center">{type === "login" ? "Log In" : "Sign Up"}</h2>
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
        {type === "login" ? "Log In" : "Create Account"}
      </button>
    </form>
  );
}
