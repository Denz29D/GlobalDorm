import React, { useEffect, useState } from 'react';
import Navbar from '../../components/common/Navbar';
import HeroSection from '../../components/common/HeroSection';
import RecommendationSection from '../../components/common/RecommendationSection';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner'
const HomePage = () => {
  const [listingsData, setListingsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const listingsPerPage = 3;

  const handleSearch = async (location, campus) => {
    setLoading(true); // Start loading
    setCurrentPage(1); // Reset to page 1 when a new search is triggered
  
    try {
      const response = await fetch(`/api/rooms/search?location=${encodeURIComponent(location)}&campus=${encodeURIComponent(campus)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      const data = await response.json();
      
      // Check if data is an array and log it
      if (Array.isArray(data)) {
        console.log('Response data:', data);
        setListingsData(data); // Set the listingsData state
      } else {
        console.error('Unexpected response format:', data);
      }
  
      setLoading(false); // End loading
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  

  useEffect(() => {
    // Fetch room data from  backend
    const fetchRooms = async () => {
      const response = await fetch('/api/rooms');
      const data = await response.json();
      console.log(data);
      setListingsData(data);
    };
    fetchRooms();
  }, []);

  const totalPages = Math.ceil(listingsData.length / listingsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentListings = listingsData.slice(
    (currentPage - 1) * listingsPerPage,
    currentPage * listingsPerPage
  );
  // console.log('Current Listings after search:', currentListings);
  return (
    <div className="bg-gray-50">
      <Navbar />
      <HeroSection onSearch={handleSearch} />
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">Error: {error}</div>
      ) : (
        <>
          <RecommendationSection listings={currentListings} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </div>
  );
  
};

export default HomePage;
