import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaBars, FaBell, } from 'react-icons/fa';
import {FiUser, FiLogOut, FiGrid, FiSettings, FiUserCheck, FiBell, FiHome, FiLayers,FiInfo,FiBriefcase,FiBookOpen} from 'react-icons/fi';
import logo from '/src/assets/logos/Logo.png';
import apiClient from '../api/apiClient';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useUser } from '../contexts/UserContext';
import NotificationPopup from './Notificationpopup'; // Import the NotificationPopup component

export default function Navbar() {

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mainMenuOpen, setMainMenuOpen] = useState(false);

  const userMenuRef = useRef();
  const mainMenuRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

 const { user,setUser } = useUser(); // ✅ Get user and loading state

  


  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY < 10) {
        setShowHeader(true);
      } else {
        setShowHeader(currentY < lastScrollY); // show when scrolling up
      }

      setLastScrollY(currentY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);


 const handleLogoutClick = async () => {
  try {
    await apiClient.post(`${user?.userType?.toLowerCase()}/auth/logout`, {}, {
      withCredentials: true,
    });
    Cookies.remove('at'); // Clear the authentication token cookie
    toast.success('Logout successful');
    setUser(null); // Clear user state
    setUserMenuOpen(false); // Close user menu
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  } catch (err) {
    console.error('Logout error:', err);
  }
};


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (mainMenuRef.current && !mainMenuRef.current.contains(event.target)) {
        setMainMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatRole = (role) => {
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const isActive = (path) => location.pathname === path;
 

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-20 transition-all duration-500 ease-in-out  
              ${showHeader ? 'translate-y-0 opacity-100 shadow-md' : '-translate-y-10 opacity-0'} 
              bg-white p-4 flex justify-between items-center border-b font-jost`}
    >

      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src={logo} alt="Company Logo" className="h-12 w-auto object-contain" />
      </Link>

      {/* Center Navigation - Desktop */}
      <div className="hidden md:flex gap-6 text-gray-700 text-md font-medium">
        {['/', '/about', '/jobs', '/companies', '/courses'].map((path) => (
          <Link
            key={path}
            to={path}
            className={`hover:text-indigo-800 ${isActive(path) ? 'font-bold text-indigo-800' : ''}`}
          >
            {path === '/' ? 'Home' : path.slice(1).replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </Link>
        ))}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {!user && (
          <Link
            to="/register"
            className="bg-gradient-to-r from-teal-500 to-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:opacity-90"
          >
            Register
          </Link>

        )}

        {user && (
          <div className="flex items-center gap-4 px-4">
            {/* Notification */}
                 <NotificationPopup />


            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="w-9 h-9 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-semibold"
              >
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl border border-gray-200 rounded-xl z-20 text-sm">
                  {/*   Info Header */}
                  <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-200">
                    <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full">
                      <FiUser size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{formatRole(user.userType)}</p>
                    </div>
                  </div>

                  {/* Menu Links */}
                  <div className="flex flex-col py-2 px-2 space-y-1">
                    <Link
                      to={`/${user?.userType?.toLowerCase()}/dashboard`}
                       onClick={() => setUserMenuOpen((prev) => !prev)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 transition ${isActive(`/${user?.role?.toLowerCase()}/dashboard`)
                        ? 'text-indigo-700 font-medium'
                        : 'text-gray-700'
                        }`}
                    >
                      <FiGrid size={16} />
                      Dashboard
                    </Link>

                    {/* <Link
                      to={`/${user?.role?.toLowerCase()}/profile`}
                       onClick={() => setUserMenuOpen((prev) => !prev)}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-700"
                    >
                      <FiUserCheck size={16} />
                      My Profile
                    </Link> */}

                    <Link
                        to={`/${user?.userType?.toLowerCase()}/profileview`}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-700"
                      >
                        <FiUserCheck size={16} />
                        My Profile
                      </Link>


                    <Link
                      to="/account-settings"
                       onClick={() => setUserMenuOpen((prev) => !prev)}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-700"
                    >
                      <FiSettings size={16} />
                      Account Settings
                    </Link>
                  </div>

                  <hr className="my-2 border-gray-200" />

                  {/* Logout */}
                  <div className="px-2 pb-3">
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center gap-2 w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <FiLogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Hamburger - Mobile only */}
            <div className="md:hidden relative" ref={mainMenuRef}>
              <button
                onClick={() => setMainMenuOpen((prev) => !prev)}
                className="text-gray-700 text-2xl"
              >
                <FaBars />
              </button>
              {mainMenuOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg w-52 z-20 border text-sm p-2">
                  {[
                    { path: '/', label: 'Home', icon: <FiHome /> },
                    { path: '/about', label: 'About', icon: <FiInfo /> },
                    { path: '/jobs', label: 'All Jobs', icon: <FiBriefcase /> },
                    { path: '/companies', label: 'Companies', icon: <FiLayers /> },
                    { path: '/courses', label: 'Courses', icon: <FiBookOpen /> },
                  ].map(({ path, label, icon }) => (
                    <Link
                      key={path}
                      to={path}
                      className={`flex items-center gap-2 px-3 py-3 rounded-lg hover:bg-indigo-50 transition ${isActive(path) ? 'font-semibold text-indigo-700' : 'text-gray-700'
                        }`}
                    >
                      <span className="text-base">{icon}</span>
                      <span>{label}</span>
                    </Link>
                  ))}
                </div>
              )}

            </div>
          </div>

        )}
      </div>
    </nav>
  );
}
