import React, { useState } from "react";
import BasicModal from "../common/BasicModal.jsx";
import logo from "../../assets/logo.png";
import { useAuth } from "../../hooks/AuthContext.jsx";
import { LogOut, User } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    setShowModal(true);
  };

  const confirmLogout = () => {
    logout();
    window.location.reload();
  };

  const cancelLogout = () => {
    setShowModal(false);
  };

  return (
    <nav className="bg-gray-950 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
          </div>
          <div className="flex items-center space-x-4">
            {user && user.type === "student" && <BasicModal />}
            <div className="flex items-center space-x-2 text-white">
              <User size={20} />
              <span className="font-medium">{user.username}</span>
            </div>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-800 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              onClick={handleLogout}
            >
              <LogOut size={20} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed z-50 inset-0 bg-gray-800 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Logout</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to logout? You'll need to log in again to access your account.</p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                onClick={cancelLogout}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150 ease-in-out"
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;