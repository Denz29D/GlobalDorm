import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/common/Navbar';

const MyReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roomNames, setRoomNames] = useState({});

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('/api/bookings/reservations', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reservations.');
        }

        const data = await response.json();
        setReservations(data);

        const roomIds = data.map((reservation) => reservation.roomId);
        const roomNamesData = await fetchRoomNames(roomIds);
        setRoomNames(roomNamesData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();

    // WebSocket setup
    const socket = new SockJS('/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });

    stompClient.onConnect = () => {
      console.log('WebSocket connected');
      stompClient.subscribe('/topic/booking-updates', (message) => {
        const update = JSON.parse(message.body);
        toast.success(`Booking ${update.bookingId} status updated to ${update.status}`, {
          position: 'bottom-right',
        });

        // Update reservations in real-time
        setReservations((prev) =>
          prev.map((res) =>
            res.id === update.bookingId ? { ...res, status: update.status } : res
          )
        );
      });
    };

    stompClient.onStompError = (frame) => {
      console.error('WebSocket error', frame.headers['message']);
    };

    stompClient.activate();

    return () => {
      if (stompClient) stompClient.deactivate();
    };
  }, []);

  const fetchRoomNames = async (roomIds) => {
    const roomNamesData = {};
    for (const roomId of roomIds) {
      try {
        const response = await fetch(`/api/rooms/${roomId}`);
        if (response.ok) {
          const room = await response.json();
          roomNamesData[roomId] = room.title;
        }
      } catch (error) {
        console.error(`Failed to fetch room name for roomId ${roomId}`, error);
      }
    }
    return roomNamesData;
  };

  const handleCancelReservation = async (reservationId) => {
    console.log('Cancelling reservation with ID:', reservationId); // Log reservationId
    try {
      const response = await fetch(`/api/reservations/update-status/${reservationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'cancelled' }), // Add status in the request body
      });
  
      if (response.ok) {
        setReservations((prev) =>
          prev.map((res) =>
            res.id === reservationId ? { ...res, status: 'cancelled' } : res
          )
        );
        toast.success('Reservation cancelled successfully.');
      } else {
        const errorData = await response.json(); // Parse error response
        console.error('Error cancelling reservation:', errorData);
        toast.error(errorData.message || 'Error cancelling reservation.');
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      toast.error('Error cancelling reservation.');
    }
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">My Reservations</h1>
        {reservations.length === 0 ? (
          <p className="text-gray-600">You have no reservations at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                roomName={roomNames[reservation.roomId]}
                onCancel={() => handleCancelReservation(reservation.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ReservationCard = ({ reservation, roomName, onCancel }) => {
  const { checkInDate, checkOutDate, status, createdAt, phoneNumber } = reservation;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-2">
        {roomName ? `Reservation for ${roomName}` : `Reservation`}
      </h2>
      <p className="text-gray-700 mb-1">
        <strong>Check-In Date:</strong> {new Date(checkInDate).toLocaleDateString()}
      </p>
      <p className="text-gray-700 mb-1">
        <strong>Check-Out Date:</strong> {new Date(checkOutDate).toLocaleDateString()}
      </p>
      <p className="text-gray-700 mb-1">
        <strong>Status:</strong> {status}
      </p>
      <p className="text-gray-700 mb-1">
        <strong>Created At:</strong> {new Date(createdAt).toLocaleDateString()}
      </p>
      <p className="text-gray-700">
        <strong>Phone Number:</strong> {phoneNumber}
      </p>
      {status !== 'cancelled' && (
        <button
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          onClick={onCancel}
        >
          Cancel Reservation
        </button>
      )}
    </div>
  );
};

export default MyReservationsPage;
