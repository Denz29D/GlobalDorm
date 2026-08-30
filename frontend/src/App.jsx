import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/auth/login/LoginPage';
import SignUpPage from './pages/auth/signup/SignUpPage';
import HomePage from './pages/home/HomePage';

import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from './components/LoadingSpinner';
import RoomBookingPage from './pages/RoomBookingPage';
import MyReservationsPage from './pages/MyReservations';

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include', // Include cookies in request
        });

        if (res.status === 401) {
          // User is not authenticated
          return null;
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }
        return data;
      } catch (error) {
        console.error('Error fetching auth user:', error);
        return null;
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex-grow w-full h-screen">
      <Routes>
        {/* Public Route: HomePage */}
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route path="/room-booking/:id" element={<RoomBookingPage />} />
        
        <Route path="/my-reservations" element={<MyReservationsPage />} />
      
      </Routes>
    </div>
  );
}

export default App;
