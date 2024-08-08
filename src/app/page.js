"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css'; // Import the styles

// Dynamically import React Quill to prevent issues with server-side rendering
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [wordCount, setWordCount] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("/api/analyzeText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: inputText }),
    });
    const data = await response.json();
    console.log("data")
    console.log(data)
    setWordCount(data.result);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1>SnipX 2.0</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <ReactQuill
          value={inputText}
          onChange={setInputText}
          placeholder="Enter text here"
          className="w-full max-w-lg p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>
      {wordCount !== null && (
        <p className="mt-4">Result: {wordCount}</p>
      )}
    </main>
  );
}
