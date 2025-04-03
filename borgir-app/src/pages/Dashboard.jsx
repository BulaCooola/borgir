// import { useUser, RedirectToSignIn } from "@clerk/clerk-react";

export default function Dashboard() {
  // const { user } = useUser();

  // if (!user) {
  //   return <RedirectToSignIn />;
  // }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Hello! 👋</h1>
      <p className="text-gray-700 mt-2">Welcome to your burger review dashboard.</p>
    </div>
  );
}
