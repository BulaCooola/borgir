import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl text-center bg-white p-8 rounded-2xl shadow-lg">
        {isSignedIn ? (
          <>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.firstName}!</h1>
            <p className="text-gray-600 mt-4">Glad to see you again. Explore your dashboard.</p>
            <UserButton afterSignOutUrl="/" className="mt-6" />
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Our Platform</h1>
            <p className="text-gray-600 mt-4">
              Sign up to unlock all features and start exploring.
            </p>
            <div className="flex space-x-4 mt-6">
              <Link to="/login" className="mr-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Log In</button>
              </Link>
              <SignUpButton>
                <button className="bg-green-500 text-white px-4 py-2 rounded-md">Sign Up</button>
              </SignUpButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
