import React, { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/Dashboard/Sidebar';
import ProblemGenerator from '../../components/Dashboard/ProblemGenerator';
import JudgeProblems from '../../components/Dashboard/JudgeProblems'; 
import FavouriteProblems from '../../components/Dashboard/FavouriteProblems';
import History from '../../components/Dashboard/History';
import { showToast } from '../../components/Toast/CustomToast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleLogout = async () => {
    try {
      await logout();
      showToast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      showToast.error('Error logging out');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-[#002029]">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content */}
      <div 
        className={`min-h-screen flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'md:ml-64' : 'md:ml-16'
        }`}
      >
        {/* Top Bar */}
        <div className="bg-[#002029] border-b border-[#005066] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleSidebar}
              className="md:hidden text-white hover:text-gray-300 transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-2xl font-bold text-white">
              {activeSection === 'dashboard' && 'Dashboard'}
              {activeSection === 'vjudge' && 'Submit Problems'}
              {activeSection === 'history' && 'History'}
              {activeSection === 'favorites' && 'Favourite Problems'}
              {activeSection === 'profile' && 'Profile'}
            </h1>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-white font-medium">{user?.name || 'User'}</p>
              <p className="text-gray-300 text-sm">{user?.email || 'user@example.com'}</p>
            </div>
            {/* <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-[#00303d] hover:bg-[#004052] text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button> */}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 md:p-8">
            {/* Placeholder for different sections */}
            {activeSection === 'dashboard' && (
              <ProblemGenerator />
            )}

            {activeSection === 'vjudge' && (
              <JudgeProblems />
            )}

            {activeSection === 'history' && (
              <History />
            )}

            {activeSection === 'favorites' && (
              <FavouriteProblems />
            )}

            {activeSection === 'profile' && (
              <div className="text-white">
                <div className="bg-[#00607a] rounded-2xl shadow-2xl p-8">
                  <h2 className="text-3xl font-bold mb-4">Profile</h2>
                  <p className="text-gray-300">Profile content will go here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
