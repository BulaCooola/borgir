import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function NavBar() {
  // const { signOut } = useAuth();

  return <h1>Bruh</h1>;

  // return (
  //   <nav className="p-4 bg-yellow-500 flex justify-between items-center">
  //     <h1 className="text-xl font-bold">Borgir 🍔</h1>
  //     <div>
  //       <Link to="/" className="mr-4">
  //         Home
  //       </Link>

  //       <Link to="/forum" className="mr-4">
  //         Forum
  //       </Link>

  //       <Link to="/reviews" className="mr-4">
  //         Reviews
  //       </Link>

  //       <SignedIn>
  //         <Link to="/dashboard" className="mr-4">
  //           Dashboard
  //         </Link>

  //         <Link to="/post" className="mr-4">
  //           Post
  //         </Link>

  //         <button onClick={() => signOut()} className="bg-red-500 px-3 py-1 rounded text-white">
  //           Logout
  //         </button>

  //         <UserButton className="px-3 mx-4" />
  //       </SignedIn>

  //       <SignedOut>
  //         <SignInButton
  //           mode="modal"
  //           className="bg-blue-500 px-3 py-1 rounded text-white cursor-pointer"
  //         >
  //           <button>Sign In</button>
  //         </SignInButton>
  //       </SignedOut>
  //     </div>
  //   </nav>
  // );
}
