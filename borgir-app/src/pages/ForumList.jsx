import { useState, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function ForumList() {
  const { data, error } = useSWR("http://localhost:3000/burgers", fetcher);
  console.log(data);

  const { isSignedIn, user } = useUser();
  const [topics, setTopics] = useState([
    {
      id: 1,
      title: "Best Burger in Town?",
      description: "Where can I find the best burger?",
      author: "John Doe",
      replies: [],
    },
    {
      id: 2,
      title: "Homemade Burger Tips",
      description: "What are your favorite homemade burger recipes?",
      author: "Jane Smith",
      replies: [],
    },
  ]);
  const [newTopic, setNewTopic] = useState({ title: "", description: "" });
  const [showReplies, setShowReplies] = useState({}); // Track visibility of replies

  const addTopic = () => {
    if (!newTopic.title.trim() || !newTopic.description.trim()) return;
    const newEntry = {
      id: topics.length + 1,
      title: newTopic.title,
      description: newTopic.description,
      author: user?.firstName || "Anonymous",
      replies: [],
    };
    setTopics([...topics, newEntry]);
    setNewTopic({ title: "", description: "" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl w-full bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🍔 Burger Forum</h1>

        {/* New Topic Section (Only for Signed-In Users) */}
        {isSignedIn ? (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Start a Discussion</h2>
            <input
              className="w-full p-2 border rounded-md text-gray-600 mb-2"
              placeholder="Topic Title"
              value={newTopic.title}
              onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
            />
            <textarea
              className="w-full p-2 border rounded-md text-gray-600"
              rows="3"
              placeholder="Write a description..."
              value={newTopic.description}
              onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2" onClick={addTopic}>
              Post Topic
            </button>
            <div className="mt-4">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        ) : (
          <div className="mb-6 text-center">
            <p className="text-gray-600">Sign in to start a discussion.</p>
            <SignInButton>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">Sign In</button>
            </SignInButton>
          </div>
        )}

        {/* Forum Topics List */}
        <div className="space-y-4">
          {topics.map((topic) => (
            <div key={topic.id} className="border p-4 rounded-md shadow-sm bg-white">
              <h2 className="font-bold text-lg text-gray-900">{topic.title}</h2>
              <p className="text-gray-700">{topic.description}</p>
              <p className="text-sm text-gray-500">Posted by {topic.author}</p>

              {/* Button to Toggle Replies */}
              <button
                className="mt-3 text-blue-600 hover:underline"
                onClick={() => setShowReplies((prev) => ({ ...prev, [topic.id]: !prev[topic.id] }))}
              >
                💬 {topic.replies.length} Comments
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
