import React from 'react';
import SearchForm from './SearchForm';

const HeroSection = ({ onSearch }) => {
  return (
    <div className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: `url('/BannerHome2.jpg')` }}>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Find your favorite place here!</h1>
        <p className="text-lg md:text-xl mb-6">The best prices for over 2 million properties worldwide</p>
        {/* Pass the onSearch prop to the SearchForm */}
        <SearchForm onSearch={onSearch} />
      </div>
    </div>
  );
};

export default HeroSection;
