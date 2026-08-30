import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import Modal from '../components/common/Modal';
import { useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import LoadingSpinner from '../components/LoadingSpinner';
import { useQuery } from '@tanstack/react-query'; // useQuery to check auth status
import LoginSignupModal from '../components/common/LoginSignUpModal';

const customMarker = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const RoomBookingPage = () => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginSignupModal, setShowLoginSignupModal] = useState(false); // State for login/signup modal
  const [campus, setCampus] = useState('');
  const [distance, setDistance] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [weatherData, setWeatherData] = useState([]);
  const [crimeData, setCrimeData] = useState([]); // State to store crime data
  const [loading, setLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [crimeLoading, setCrimeLoading] = useState(true); // State for crime data loading

  // Check if the user is authenticated using useQuery
  const { data: authUser } = useQuery({ queryKey: ['authUser'] });

  // Fetch room details
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/rooms/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch room data');
        }
        const data = await response.json();
        setRoomData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching room data:', error);
        setLoading(false);
      }
    };
    fetchRoomData();
  }, [id]);

  // Fetch weather and crime data based on room postcode
  useEffect(() => {
    if (roomData?.postCode) {
      const fetchCoordinatesAndWeatherAndCrime = async () => {
        try {
          const weatherResponse = await fetch(`http://localhost:5000/api/weather/forecast?postcode=${roomData.postCode}`);
          const weather = await weatherResponse.json();
          const lat = weather.city.coord.lat;
          const lon = weather.city.coord.lon;
          setCoordinates([lat, lon]);
          setWeatherData(weather.list);

          // Fetch crime data based on the coordinates (limit to 10)
          const crimeResponse = await fetch(`http://localhost:5000/api/crime/location?lat=${lat}&lon=${lon}`);
          const crimes = await crimeResponse.json();
          setCrimeData(crimes.slice(0, 10)); // Limit to first 10 crimes
        } catch (error) {
          console.error('Error fetching weather or crime data:', error);
        } finally {
          setWeatherLoading(false);
          setCrimeLoading(false);
        }
      };
      fetchCoordinatesAndWeatherAndCrime();
    }
  }, [roomData]);

  const handleCampusSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/distance/calculate?startPostcode=${roomData.postCode}&endPostcode=${campus}`);
      if (!response.ok) {
        throw new Error('Failed to calculate distance');
      }
      const data = await response.json();
      setDistance(data.distance);
    } catch (error) {
      console.error('Error calculating distance:', error);
    }
  };

  const handleBookClick = () => {
    if (authUser) {
      setIsModalOpen(true); // Show booking modal if user is authenticated
    } else {
      setShowLoginSignupModal(true); // Show login/signup modal if user is not authenticated
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowLoginSignupModal(false); // Close both modals
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!roomData) {
    return <div>Room not found</div>;
  }

  const { title, price, address, postCode, bedrooms, bathrooms, size, image, roomType, spokenLanguages } = roomData;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="relative h-[50vh] bg-cover bg-center" style={{ backgroundImage: `url('/assets/${image}')` }}>
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">{title}</h1>
        <p className="text-lg md:text-xl">{bedrooms} Beds • {bathrooms} Baths • {size} sq ft • ${price}/month</p>
        <p className="text-lg md:text-xl">Postcode: {postCode}</p>
        <p className="text-lg md:text-xl">Room Type: {roomType}</p>
        <p className="text-lg md:text-xl">Languages Spoken: {spokenLanguages?.join(', ') || 'N/A'}</p> {/* Add spoken languages */}
      </div>
    </div>


      <div className="container mx-auto py-10 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-10">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-4">Room Information</h2>
          <p className="text-gray-700 mb-4">Spacious, fully furnished, and equipped with modern amenities.</p>
          <div className="flex items-center text-gray-500 mb-4">
            <FaMapMarkerAlt className="text-blue-600 mr-2" />
            <span>{address}</span>
          </div>
          <div className="text-lg mb-6">
            <span className="font-semibold">Price: </span>${price}/month
          </div>

          {distance !== null ? (
            <p className="text-green-600 font-semibold mb-4">
              Distance to campus: {distance.toFixed(2)} km
            </p>
          ) : (
            <p className="text-gray-500 mb-4">Enter a campus postcode to calculate the distance</p>
          )}

          <form onSubmit={handleCampusSearch} className="flex space-x-2 mb-6">
            <input
              type="text"
              placeholder="Enter campus postcode"
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              className="flex-1 p-3 rounded-md border text-black border-gray-300 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700"
            >
              Calculate Distance
            </button>
          </form>

          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            onClick={handleBookClick}
          >
            Book Now
          </button>
        </div>

        <div className="flex-1">
          {/* Map section */}
          {coordinates ? (
            <MapContainer center={coordinates} zoom={13} style={{ height: '350px', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={coordinates} icon={customMarker}>
                <Popup>{address}</Popup>
              </Marker>
            </MapContainer>
          ) : (
            <p>Loading map...</p>
          )}
        </div>
      </div>

      {/* Weather forecast section */}
      <div className="container mx-auto py-10">
        <h2 className="text-3xl font-bold mb-6">Weather Forecast</h2>

        {weatherLoading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <div className="overflow-y-scroll max-h-80">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {weatherData.map((forecast, index) => (
                <div key={index} className="text-center p-4 bg-white shadow rounded-lg">
                  <h3 className="text-lg font-semibold">{new Date(forecast.dt_txt).toLocaleString()}</h3>
                  <p className="text-gray-700">{forecast.weather[0].description}</p>
                  <p className="text-gray-500">{Math.round(forecast.main.temp)}°C</p>
                  <img
                    src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                    alt={forecast.weather[0].description}
                    className="mx-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Crime data section */}
      <div className="container mx-auto py-10">
        <h2 className="text-3xl font-bold mb-6">Crime in Area</h2>

        {crimeLoading ? (
          <LoadingSpinner size="lg" />
        ) : crimeData.length > 0 ? (
          <div className="overflow-y-scroll max-h-80">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {crimeData.map((crime, index) => (
                <div key={index} className="p-4 bg-red-100 shadow rounded-lg">
                  <h3 className="text-lg font-semibold text-red-600">{crime.category}</h3>
                  <p className="text-gray-700">Date: {crime.month}</p>
                  <p className="text-gray-500">Location: {crime.location.street.name}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No crimes reported in the area.</p>
        )}
      </div>

      {isModalOpen && <Modal onClose={closeModal} roomId={roomData.id}/>}

      {showLoginSignupModal && <LoginSignupModal onClose={closeModal} />}
    </div>
  );
};

export default RoomBookingPage;
