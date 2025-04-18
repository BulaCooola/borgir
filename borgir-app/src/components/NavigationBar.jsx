import { Link } from "react-router-dom";
// import { useAuth, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function NavigationBar() {
  //   const { signOut } = useAuth();
  return (
    <nav className="p-4 bg-yellow-500 flex justify-between items-center">
      <h1 className="text-xl font-bold">Borgir 🍔</h1>
      <div>
        <Link to="/" className="mr-4">
          Home
        </Link>

        <Link to="/forum" className="mr-4">
          Forum
        </Link>

        <Link to="/reviews" className="mr-4">
          Reviews
        </Link>

        <Link to="/dashboard" className="mr-4">
          Dashboard
        </Link>

        <Link to="/post" className="mr-4">
          Post
        </Link>

        {/* <SignedIn>

          <button onClick={() => signOut()} className="bg-red-500 px-3 py-1 rounded text-white">
            Logout
          </button>

          <UserButton className="px-3 mx-4" />
        </SignedIn>

        <SignedOut>
          <SignInButton
            mode="modal"
            className="bg-blue-500 px-3 py-1 rounded text-white cursor-pointer"
          >
            <button>Sign In</button>
          </SignInButton>
        </SignedOut> */}
      </div>
    </nav>
  );
}
