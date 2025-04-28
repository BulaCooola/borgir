import { useEffect } from "react";
// import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function HomePage() {
  // const { isSignedIn, user } = useUser();

  useEffect(() => {
    async function getUserAndNotifications() {
      await axios.post("http://localhost:3000/newUser", {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.imageUrl,
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl text-center bg-white p-8 rounded-2xl shadow-lg">
        <h1> Hello</h1>
      </div>
    </div>
  );
}
