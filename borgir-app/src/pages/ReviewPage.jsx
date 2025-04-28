import React, { useState, useEffect } from "react";
import axios from "axios";

import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";
import BurgerForm from "../components/BurgerForm";

export default function ReviewPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-5xl font-bold text-gray-900 mb-6">REVIEWS</h1>

      <div className="flex flex-row m-4">
        <div className="mx-4">
          <BurgerForm />
        </div>
        <div className="mx-4">
          <ReviewForm />
        </div>
      </div>
      <ReviewList />
    </div>
  );
}
