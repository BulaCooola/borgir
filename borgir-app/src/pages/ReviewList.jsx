import { useState } from "react";
import useSWR from "swr";
import axios from "axios";
// import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";

import { getReviews, reviewURLEndpoint as cacheKey } from "../api/borgirAPI";
import ReviewForm from "./ReviewForm";

// const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function ReviewList() {
  const {
    data: topics,
    error,
    isLoading,
    mutate,
  } = useSWR(cacheKey, getReviews, { onSuccess: (data) => data.sort((a, b) => b.id - a.id) });
  // ! Change the sorting such that the newest review is on

  // const { isSignedIn, user } = useUser();

  const [newTopic, setNewTopic] = useState({ title: "", description: "" });
  const [showReplies, setShowReplies] = useState({}); // Track visibility of replies

  const addTopic = () => {
    if (!newTopic.title.trim() || !newTopic.description.trim()) return;
    const newEntry = {
      id: topics.length + 1,
      title: newTopic.title,
      description: newTopic.description,
      author: "Anonymous",
      replies: [],
    };
    setTopics([...topics, newEntry]);
    setNewTopic({ title: "", description: "" });
  };

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>Loading Content</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl w-full bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🍔 Burger Review</h1>

        {/* New Topic Section (Only for Signed-In Users) */}
        {/* {isSignedIn ? ( */}
        <div>
          <ReviewForm />
        </div>
        {/* ) : (
          <div className="mb-6 text-center">
            <p className="text-gray-600">Sign in to start a discussion.</p>
            <SignInButton>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">Sign In</button>
            </SignInButton>
          </div>
        )} */}

        {/* Review Topics List */}
        <div className="space-y-4">
          {!isLoading &&
            topics.map((topic) => (
              <div key={topic._id} className="border p-4 rounded-md shadow-sm bg-white">
                <h2 className="font-bold text-lg text-gray-900">{topic.comment}</h2>
                <p className="text-gray-700">{topic.description}</p>
                <p className="text-gray-700">{topic.createdAt}</p>
                <p className="text-sm text-gray-500">Posted by {topic.author}</p>

                {/* Button to Toggle Replies */}
                <button
                  className="mt-3 text-blue-600 hover:underline"
                  onClick={() =>
                    setShowReplies((prev) => ({ ...prev, [topic.id]: !prev[topic.id] }))
                  }
                >
                  {/* 💬 {topic.replies.length} Comments */}
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
