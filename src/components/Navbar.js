import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { doSignOut } from '../firebase/auth';
import Logo from '../assets/logo2.png'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userLoggedIn = false } = useAuth(); // Safeguard against undefined value
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await doSignOut(); // Handle sign-out
      navigate('/login'); // Navigate to login page after sign out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 bg-opacity-50 backdrop-blur-lg text-white p-6 fixed top-0 left-0 w-full z-50">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Website Logo */}
          <img src={Logo} alt="Life Mastery Logo" className="w-10 h-10" />
          
          {/* Website Name with Glow Effect */}
          <Link to="/" className="text-4xl font-semibold text-white-900 transition-all duration-300 text-shadow-glow  font-poppins">
  Life Mastery
</Link>


        </div>

        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-2xl hover:text-grey-500 transition-all duration-300 transform hover:scale-105">Home</Link>
          {userLoggedIn ? (
            <>
              <Link to="/dashboard" className="text-2xl hover:text-teal-500 transition-all duration-300 transform hover:scale-105">Dashboard</Link>
              <Link to="/community" className="text-2xl hover:text-teal-500 transition-all duration-300 transform hover:scale-105">Community</Link>
              <button 
                onClick={handleSignOut} 
                className="text-2xl hover:text-teal-500 transition-all duration-300 transform hover:scale-105"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-2xl hover:text-teal-500 transition-all duration-300 transform hover:scale-105">Login</Link>
              <Link to="/register" className="text-2xl hover:text-teal-500 transition-all duration-300 transform hover:scale-105">Register</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-white hover:text-teal-500 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu (hidden by default) */}
      <div className={`md:hidden flex flex-col space-y-4 mt-4 ${isMenuOpen ? 'block' : 'hidden'}`}>
        {userLoggedIn ? (
          <>
            <Link to="/dashboard" className="text-lg text-center hover:text-teal-500">Dashboard</Link>
            <Link to="/community" className="text-lg text-center hover:text-teal-500">Community</Link>
            <button 
              onClick={handleSignOut} 
              className="text-lg text-center hover:text-teal-500"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-lg text-center hover:text-teal-500">Login</Link>
            <Link to="/register" className="text-lg text-center hover:text-teal-500">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
