// src/components/common/LoginSignupModal.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const LoginSignupModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-96 z-50">
        <h2 className="text-2xl font-bold mb-4">Please Sign In or Sign Up to Continue</h2>
        <div className="flex justify-between">
          <Link to="/login">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Sign In
            </button>
          </Link>
          <Link to="/signup">
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Sign Up
            </button>
          </Link>
        </div>
        <div className="flex justify-end mt-4">
          <button className="bg-gray-300 px-4 py-2 rounded-md" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupModal;
