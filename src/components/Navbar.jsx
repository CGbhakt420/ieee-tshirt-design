// src/components/Navbar.jsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import { slideAnimation } from '../config/motion';

const Navbar = () => {
  const navigate = useNavigate();

  // This logic can be simplified
  const isTokenValid = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const { exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        localStorage.removeItem('token');
        return false;
      }
      return true;
    } catch (error) {
      localStorage.removeItem('token');
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const isLoggedIn = isTokenValid();

  return (
    <motion.nav
      {...slideAnimation('down')}
      className="fixed top-0 left-0 w-full z-50 flex justify-between items-center py-4 px-6 md:px-12 bg-black bg-opacity-20 backdrop-blur-sm"
    >
      {/* Replaced the image icon with a styled text logo */}
      <div
        className="flex-1 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <h1 className="text-xl font-black text-white">3Shirts</h1>
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <button onClick={() => navigate('/community')} className="nav-button px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
              Community
            </button>
            <button onClick={() => navigate('/saved-designs')} className="nav-button px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
              Dashboard
            </button>
            {/* Gradient border button for Logout */}
            <div className="relative p-0.5 rounded-lg bg-gradient-to-r from-fuchsia-500 to-purple-600">
              <button
                onClick={handleLogout}
                className="w-full h-full bg-gray-900 text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-80 transition"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Gradient border button for Login */}
            <div className="relative p-0.5 rounded-lg bg-gradient-to-r from-fuchsia-500 to-purple-600">
              <button
                onClick={() => navigate('/login')}
                className="w-full h-full bg-gray-900 text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-80 transition"
              >
                Login
              </button>
            </div>
            {/* Filled gradient button for Signup */}
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
