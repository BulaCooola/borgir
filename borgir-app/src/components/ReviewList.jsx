import { useEffect, useState } from "react";
import useSWR from "swr";
import axios from "axios";
// import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";

import { getReviews, reviewURLEndpoint as cacheKey } from "../api/borgirAPI";
import ReviewForm from "./ReviewForm";

import UserModal from "./UserModal";
// const fetcher = (url) => axios.get(url).then((res) => res.data);

const borgirAPI = axios.create({
  baseURL: "http://localhost:3000",
});

export default function ReviewList() {
  const {
    data: topics,
    error,
    isLoading,
    mutate,
  } = useSWR(cacheKey, getReviews, { onSuccess: (data) => data.sort((a, b) => b.id - a.id) });
  // ! Change the sorting such that the newest review is on

  const {
    data: burgers,
    error: burgersError,
    isLoading: burgersLoading,
  } = useSWR("/burgers", async (url) => {
    const res = await borgirAPI.get("/burgers");
    return res.data; // assuming it returns an array of burgers [{id, name, restaurant}]
  });

  const findBurgerById = (id) => {
    if (!burgers) return null;
    return burgers.find((burger) => burger._id === id);
  };

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

  useEffect(() => {}, []);

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>Loading Content</div>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6 w-full">
      <div className="max-w-3xl w-full bg-white p-8 rounded-2xl shadow-lg">
        {/* New Topic Section (Only for Signed-In Users) */}
        {/* {isSignedIn ? ( */}

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
            topics.map((topic) => {
              const burger = findBurgerById(topic.burgerId);

              return (
                <div key={topic._id} className="border p-4 rounded-md shadow-sm bg-white">
                  {/* ⭐ Rating */}
                  {topic.rating !== undefined && (
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-400 text-lg">⭐</span>
                      <span className="ml-1 text-gray-700 font-medium">{topic.rating} / 10</span>
                      <span>
                        {" "}
                        <h1 className="px-7 text-2xl text-gray-700">
                          🍔{" "}
                          {burger ? `${burger.name} from ${burger.restaurant}` : "Unknown Burger"}
                        </h1>
                      </span>
                    </div>
                  )}

                  <h2 className="font-bold text-lg text-gray-900">{topic.comment}</h2>

                  <p className="text-gray-700 mt-2">{new Date(topic.createdAt).toLocaleString()}</p>
                  {/* <p className="text-sm text-gray-500" id={topic.userId}>
                    Posted by {topic.username}
                  </p> */}
                  <UserModal userId={topic.userId} username={topic.username} />

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
              );
            })}
        </div>
      </div>
    </div>
  );
}
