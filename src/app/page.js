"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css'; // Import the styles

// Dynamically import React Quill to prevent issues with server-side rendering
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState({ green: [], orange: [], red: [] });

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
    console.log("data", data);
    setResults(data);
  };

  const handleInputChange = (category, index, value) => {
    setResults((prevResults) => ({
      ...prevResults,
      [category]: prevResults[category].map((item, idx) =>
        idx === index ? value : item
      ),
    }));
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1>SnipX 2.0</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-lg">
        <ReactQuill
          value={inputText}
          onChange={setInputText}
          placeholder="Enter text here"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>

      <div className="flex flex-col items-center w-full max-w-lg mt-8 space-y-4">
        {results.green.length > 0 && (
          <div className="w-full">
            <h2 className="text-green-500 text-center mb-2">Green:</h2>
            {results.green.map((item, index) => (
              <input
                key={`green-${index}`}
                type="text"
                value={item}
                onChange={(e) => handleInputChange('green', index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-black"
              />
            ))}
          </div>
        )}

        {results.orange.length > 0 && (
          <div className="w-full">
            <h2 className="text-orange-500 text-center mb-2">Orange:</h2>
            {results.orange.map((item, index) => (
              <input
                key={`orange-${index}`}
                type="text"
                value={item}
                onChange={(e) => handleInputChange('orange', index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-black"
              />
            ))}
          </div>
        )}

        {results.red.length > 0 && (
          <div className="w-full">
            <h2 className="text-red-500 text-center mb-2">Red:</h2>
            {results.red.map((item, index) => (
              <input
                key={`red-${index}`}
                type="text"
                value={item}
                onChange={(e) => handleInputChange('red', index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-black"
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
