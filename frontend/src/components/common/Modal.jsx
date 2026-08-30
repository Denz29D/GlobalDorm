import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirecting
import toast from 'react-hot-toast';

const Modal = ({ onClose, roomId }) => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [isBookingSuccess, setIsBookingSuccess] = useState(false); // State for booking success
  const { data: authUser } = useQuery({ queryKey: ['authUser'] });
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // useNavigate hook for navigation

  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '', // Phone number field
  });

  // Mutation for creating a booking
  const bookingMutation = useMutation({
    mutationFn: async (bookingData) => {
      const response = await fetch('http://localhost:5000/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for auth
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success('Booking successfully created!');
      queryClient.invalidateQueries(['myBookings']);
      setIsBookingSuccess(true); // Set state to show success modal
      setTimeout(() => {
        navigate('/'); // Redirect to homepage after a delay
      }, 2000); // 2-second delay
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!authUser) {
      toast.error('You need to be logged in to make a booking');
      return;
    }

    const bookingData = {
      roomId,
      userId: authUser.id,
      phoneNumber: personalInfo.phoneNumber,
      checkInDate,
      checkOutDate,
      email: authUser.email,
    };

    bookingMutation.mutate(bookingData);
  };

  if (isBookingSuccess) {
    // Render success message
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
        <div className="relative bg-white p-8 rounded-lg shadow-lg w-96 z-50 text-center">
          <h2 className="text-2xl font-bold mb-4">Booking Request Submitted</h2>
          <p className="text-gray-700 mb-4">You will be redirected to the homepage shortly...</p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
            onClick={() => navigate('/')}
          >
            Go to Homepage Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="absolute inset-0 bg-black opacity-50 z-40" onClick={onClose}></div>

      <div className="relative bg-white p-8 rounded-lg shadow-lg w-96 z-50">
        <h2 className="text-2xl font-bold mb-4">Book Your Stay</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Check-in Date</label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Check-out Date</label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={personalInfo.firstName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={personalInfo.lastName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={personalInfo.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded-md mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
              disabled={bookingMutation.isLoading}
            >
              {bookingMutation.isLoading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
