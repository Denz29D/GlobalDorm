import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';

import {useMutation, useQueryClient} from "@tanstack/react-query"
const Navbar = () => {
  const navigate = useNavigate();
  const { data: authUser } = useQuery({ queryKey: ['authUser'] });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const queryClient = useQueryClient();
  
	const { mutate: Processlogout } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/auth/logout", {
					method: "POST",
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
		toast.success("Logout sucess");

		queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError:() => {
			toast.error("Logout failed")
			
		}
	});
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <nav className="bg-gray-50 shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Branding / Logo */}
        <div className="flex items-center space-x-3">
          <span className="text-xl font-bold text-blue-700">DormGlobal</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="/" className="text-gray-600 hover:text-blue-500">
            Home
          </a>
          <a href="" className="text-gray-600 hover:text-blue-500">
            About Us
          </a>
          <a href="" className="text-gray-600 hover:text-blue-500">
            Activity
          </a>
          <a href="" className="text-gray-600 hover:text-blue-500">
            Coupons and Promos
          </a>
        </div>

        {/* User Authentication or Profile */}
        <div className="relative flex items-center space-x-4">
          {authUser ? (
            <div className="text-center" ref={dropdownRef}>
              <img
                src={authUser.profileImg || '/avatar-placeholder.png'}
                alt="User Avatar"
                className="rounded-full w-10 h-10 border-2 border-gray-300 mx-auto cursor-pointer"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              />
              <p className="text-sm text-gray-700 mt-1">{authUser.fullName}</p>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                  <Link
                    to="/my-reservations"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    My Reservations
                  </Link>
                  <button
                    onClick={() => {
                      e.preventDefault(); //prevent from taking us to profile page
								      Processlogout();
                      navigate('/');
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
              <button
                className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
