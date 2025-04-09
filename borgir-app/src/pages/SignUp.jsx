// pages/Signup.jsx
import { useState } from "react";
import { signupUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signupUser({ email, password, firstName, lastName, username });

      localStorage.setItem("token", res.token); // Save the JWT
      navigate("/"); // Redirect to homepage or dashboard
    } catch (err) {
      alert("Authentication failed");
      console.error(err);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-center">Sign Up</h2>
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
      <input
        className="border p-2 w-full rounded"
        type="text"
        name="firstname"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        className="border p-2 w-full rounded"
        type="text"
        name="lastname"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        className="border p-2 w-full rounded"
        type="text"
        name="username"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button className="bg-black text-white px-4 py-2 rounded w-full" type="submit">
        Create Account
      </button>
    </form>
  );
}
