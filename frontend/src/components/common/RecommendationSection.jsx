import React from 'react';
import ListingCard from './ListingCard';

const RecommendationSection = ({ listings }) => {
  return (
    <div className="px-6 py-10 bg-gray-50">
      <h2 className="text-2xl md:text-3xl mb-6">Accommodation recommendations for you</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map((listing, index) => {
          const room = listing.room || listing; // Handle both cases
          const distance = listing.distance !== undefined ? listing.distance : -1; // Handle distance for search case

          if (!room) {
            console.error(`Room is undefined at index ${index}`, listing);
            return null; // Skip rendering if room is not defined
          }

          return (
          <ListingCard
            key={room.id}
            id={room.id}
            title={room.title}
            price={room.price}
            address={room.address}
            bedrooms={room.bedrooms}
            bathrooms={room.bathrooms}
            size={room.size}
            image={room.image}
            addedToday={room.addedToday}
            distance={distance} // Pass the distance, defaulting to -1 if not present
            roomType={room.roomType} // Add roomType
            postCode={room.postCode} // Add postCode
            spokenLanguages={room.spokenLanguages} // Add spoken languages
          />

          );
        })}
      </div>
    </div>
  );
};

export default RecommendationSection;
