import React from 'react';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ListingCard = ({ id, title, price, address, bedrooms, bathrooms, size, image, addedToday, distance, postCode, roomType, spokenLanguages }) => {
  const navigate = useNavigate();

  const handleViewRoomClick = () => {
    navigate(`/room-booking/${id}`, {
      state: {
        title,
        price,
        address,
        bedrooms,
        bathrooms,
        size,
        image,
        addedToday,
        distance,
        postCode,
        roomType,
        spokenLanguages
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg hover:cursor-pointer overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl">
      <div className="relative">
        {addedToday && (
          <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
            Added today
          </span>
        )}
        <img src={`/assets/${image}`} alt={title} className="w-full h-48 object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-500 text-sm">{address}</p>
        <p className="text-gray-500 text-sm">Postcode: {postCode}</p> {/* Add postcode */}
        <p className="text-gray-500 text-sm">Room Type: {roomType}</p> {/* Add room type */}
        <div className="flex items-center text-yellow-500 text-sm mt-2">
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar className="text-gray-300" />
          <span className="ml-2 text-gray-500">(4.5)</span>
        </div>
        <p className="text-blue-600 font-bold text-lg mt-2">${price} / month</p>
        <div className="flex items-center justify-between text-gray-500 text-sm mt-3">
          <span>{bedrooms} Beds</span>
          <span>{bathrooms} Baths</span>
          <span>{size} sq ft</span>
        </div>
        {distance !== -1 && (
          <p className="text-green-600 font-semibold mt-2">Distance to campus: {distance.toFixed(2)} km</p>
        )}
        <button
          onClick={handleViewRoomClick}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          View Rooms
        </button>
      </div>
    </div>
  );
};

export default ListingCard;
