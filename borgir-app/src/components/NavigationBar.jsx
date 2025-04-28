import { Link } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
// import { useAuth, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function NavigationBar() {
  const token = localStorage.getItem("token");

  //   const { signOut } = useAuth();
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="p-4 bg-yellow-500 flex justify-between items-center">
      <h1 className="text-xl font-bold">Borgir 🍔</h1>
      <div>
        {/* <Link to="/" className="mr-4">
          Home
        </Link> */}

        <Link to="/reviews" className="mr-4">
          Reviews
        </Link>

        {/* <Link to="/dashboard" className="mr-4">
          Dashboard
        </Link> */}

        {/* <Link to="/post" className="mr-4">
          Post
        </Link> */}

        {token ? (
          <button onClick={logout} className="bg-red-500 px-3 py-1 rounded text-white ml-4">
            Logout
          </button>
        ) : (
          <Link to="/login" className="bg-blue-500 px-3 py-1 rounded text-white ml-4">
            Login
          </Link>
        )}

        {!token && (
          <Link to="/sign-up" className="bg-blue-500 px-3 py-1 rounded text-white ml-4">
            Sign Up
          </Link>
        )}
      </div>
    </nav>
  );
}
