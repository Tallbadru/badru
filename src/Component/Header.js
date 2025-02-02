import React from 'react';
import { LogOut } from 'lucide-react'; // Importing a logout icon from Lucide

const Header = () => {
  const handleLogout = () => {
    alert("Logged out successfully!");
  };

  return (
    <div className="header flex justify-between items-center p-4 bg-blue-500 text-white">
      <h1 className="header__title text-xl font-bold">Welcome to Babu Rental House Dashboard</h1>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
};

export default Header;
