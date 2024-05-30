"use client"
import { useState } from 'react';

export default function Inputquery({ onSubmit }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
    setInputValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6 mb-8 bg-gray-900 p-8 rounded-lg shadow-lg">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full max-w-md p-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter your query"
      />
      <button type="submit" className="w-full max-w-md bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105">
        Submit
      </button>
    </form>
  );
}