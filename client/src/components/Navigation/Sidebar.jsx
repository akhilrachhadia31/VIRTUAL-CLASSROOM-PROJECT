import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Book, Mail } from "lucide-react";
import { useAuth } from "../../hooks/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const {user} = useAuth();
  
  const menuItems = [
    { name: "Classes", icon: Book, link: "/home" },
  ];

  if (user.type === "teacher") {
      menuItems.push({ name: "Send email", icon: Mail, link: "/home/sendmails" });
  }

  const renderListItems = (items) => {
    return items.map((item) => {
      const isActive = location.pathname === item.link;
      return (
        <li key={item.name} className="mb-2">
          <Link
            to={item.link}
            className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
              isActive
                ? "bg-teal-500 text-white shadow-2xl"
                : "text-white hover:bg-teal-700 hover:text-white"
            }`}
          >
            <item.icon className="mr-3 h-5 w-5" />
            <span className="font-medium">{item.name}</span>
          </Link>
        </li>
      );
    });
  };

  return (
    <div className="w-64 bg-gray-950 overflow-y-auto flex-shrink-0 shadow-xl">
      <nav className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold bg-clip-text text-teal-400">
            Dashboard
          </h2>
        </div>
        <ul className="space-y-4">
          {renderListItems(menuItems)}
        </ul>

        <hr className="my-6 border-gray-700" />

        <div className="mt-auto pt-6">
          <div className="rounded-lg p-4 shadow-inner bg-gray-200 bg-opacity-5">
            <h3 className="text-sm font-semibold text-white mb-2">Quick Info</h3>
            <p className="text-xs text-gray-300">
              Welcome to your dashboard. Here you can manage your classes and send emails.
            </p>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;