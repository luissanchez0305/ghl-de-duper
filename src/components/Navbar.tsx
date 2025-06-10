import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Database } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  
  // Check if current route is homepage
  const isHomePage = location.pathname === '/' || 
    location.pathname === '/gohighlevel-bulk-contact-deduper-free' || 
    location.pathname === '/merge-duplicate-contacts-gohighlevel-tool';
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage
          ? 'bg-white shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center space-x-2">
            <Database size={28} className="text-primary-600" />
            <span className="font-bold text-xl text-gray-900">GHL De-Duper</span>
          </Link>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <div className="flex space-x-6">
              <Link 
                to="/"
                className={`font-medium ${
                  isHomePage
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                } transition-colors`}
              >
                Home
              </Link>
              <a 
                href="/#pricing" 
                className="font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                Pricing
              </a>
              {isAuthenticated && (
                <Link 
                  to="/dashboard" 
                  className={`font-medium ${
                    location.pathname === '/dashboard'
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                  } transition-colors`}
                >
                  Dashboard
                </Link>
              )}
            </div>
            
            <div>
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Hello, {user?.name || 'User'}</span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 rounded-md hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/"
                className={`font-medium px-4 py-2 rounded-md ${
                  isHomePage
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <a 
                href="/#pricing" 
                className="font-medium px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </a>
              {isAuthenticated && (
                <Link 
                  to="/dashboard" 
                  className={`font-medium px-4 py-2 rounded-md ${
                    location.pathname === '/dashboard'
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 font-medium text-gray-600">
                    Hello, {user?.name || 'User'}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-2 text-left font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 font-medium text-primary-600 hover:bg-primary-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;