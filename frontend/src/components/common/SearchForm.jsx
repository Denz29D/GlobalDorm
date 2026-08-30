import React, { useState } from 'react';

const SearchForm = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [campus, setCampus] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State to hold the error message

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!location.trim()) { // Check if location is empty or whitespace
      setErrorMessage('Please enter a location to search.');
      return;
    }

    setErrorMessage(''); // Clear any previous error message
    onSearch(location, campus); // Trigger the search when form is submitted
  };

  return (
    <div className="flex flex-col items-center">
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-lg flex space-x-2 w-full max-w-2xl">
        <input
          type="text"
          placeholder="Type the location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 p-3 rounded-md text-black border border-gray-300 focus:outline-none"
        />
        <input
          type="text"
          placeholder="University"
          value={campus}
          onChange={(e) => setCampus(e.target.value)}
          className="flex-1 p-3 rounded-md border text-black border-gray-300 focus:outline-none"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700">
          Search
        </button>
      </form>
      {/* Error message */}
      {errorMessage && (
        <p className="text-red-600 mt-2 text-sm">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default SearchForm;
