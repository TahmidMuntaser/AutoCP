import React from 'react';
import { LayoutDashboard, History, Heart, User, LogOut, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { showToast } from '../../components/Toast/CustomToast';

const Sidebar = ({ activeSection, setActiveSection, isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'history',
      label: 'History',
      icon: History,
    },
    {
      id: 'favorites',
      label: 'Favourite Problems',
      icon: Heart,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      showToast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      showToast.error('Error logging out');
    }
  };

  const handleMenuClick = (id) => {
    setActiveSection(id);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Overlay for mobile - with blur effect */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden z-30 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 md:w-auto bg-[#002029] border-r border-[#005066] flex flex-col transition-all duration-300 ease-in-out z-40 overflow-hidden ${
          isOpen ? 'translate-x-0 md:w-64' : '-translate-x-full md:translate-x-0 md:w-16'
        }`}
      >
        {/* Header */}
        <div className={`px-6 py-6 border-b border-[#005066] ${!isOpen && 'hidden md:flex md:justify-center md:px-2'}`}>
          <div className="flex items-center justify-between w-full">
            <div 
              className={`flex items-center space-x-3 ${!isOpen && 'md:space-x-0 cursor-pointer'}`}
              onClick={!isOpen ? toggleSidebar : undefined}
            >
              <img 
                src="/src/assets/logo.png" 
                alt="AutoCP Logo" 
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              {isOpen && <h2 className="text-xl font-bold text-white">AutoCP</h2>}
            </div>
            {/* Toggle Button - Only show when sidebar is open */}
            {isOpen && (
              <button
                onClick={toggleSidebar}
                className="text-gray-300 hover:text-white hover:bg-[#005066] p-2 rounded-lg transition-colors"
                title="Collapse sidebar"
              >
                <ChevronLeft size={20} className="hidden md:block" />
                <X size={20} className="md:hidden" />
              </button>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className={`flex-1 px-3 py-6 space-y-2 ${!isOpen && 'hidden md:block'}`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-[#00303d] text-white shadow-lg'
                    : 'text-gray-300 hover:bg-[#005066] hover:text-white'
                } ${!isOpen && 'md:justify-center md:px-2'}`}
                title={!isOpen ? item.label : ''}
              >
                <Icon size={20} />
                {isOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className={`px-3 py-4 border-t border-[#005066] ${!isOpen && 'hidden md:block'}`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#00303d] hover:text-white transition-all duration-200 ${!isOpen && 'md:justify-center md:px-2'}`}
            title={!isOpen ? 'Logout' : ''}
          >
            <LogOut size={20} />
            {isOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
