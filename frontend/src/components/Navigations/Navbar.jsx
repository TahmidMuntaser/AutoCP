import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, Info, Mail, LayoutDashboard, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home, show: true },
    { name: 'About', path: '/about', icon: Info, show: true },
    { name: 'Contact', path: '/contact', icon: Mail, show: true },
    { name: 'Dashboard', path: user?.role === 'admin' ? '/admin' : '/dashboard', icon: LayoutDashboard, show: !!user }
  ];

  return (
    <nav className="bg-[#002029] sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <img 
              src="/src/assets/logo.png" 
              alt="AutoCP Logo" 
              className="h-10 w-10 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="text-white text-2xl font-bold tracking-tight">AutoCP</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              link.show && (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-all duration-200 ${
                    location.pathname === link.path 
                      ? 'bg-[#00303d]' 
                      : 'hover:bg-[#00303d]'
                  }`}
                >
                  <link.icon size={18} />
                  <span className="font-medium">{link.name}</span>
                </Link>
              )
            ))}

            {/* Login/Logout Button */}
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-5 py-2 ml-2 bg-[#004052] text-white rounded-lg hover:bg-[#005066] transition-all duration-200 font-medium"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-5 py-2 ml-2 bg-[#004052] text-white rounded-lg hover:bg-[#005066] transition-all duration-200 font-medium"
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-[#00303d] transition-all duration-200"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-[#00303d] border-t border-[#004052]">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              link.show && (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-white transition-all duration-200 ${
                    location.pathname === link.path 
                      ? 'bg-[#004052]' 
                      : 'hover:bg-[#004052]'
                  }`}
                >
                  <link.icon size={20} />
                  <span className="font-medium">{link.name}</span>
                </Link>
              )
            ))}

            {/* Mobile Login/Logout Button */}
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-[#004052] text-white hover:bg-[#005066] transition-all duration-200 font-medium"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-[#004052] text-white hover:bg-[#005066] transition-all duration-200 font-medium"
              >
                <LogIn size={20} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
