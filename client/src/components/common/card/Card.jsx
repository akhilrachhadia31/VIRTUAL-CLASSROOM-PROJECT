import React from "react";
import { useNavigate } from "react-router-dom";
import { URL } from "../../../constant.js";
import { useAuth } from "../../../hooks/AuthContext.jsx";

const Card = ({ classData }) => {
  const { subject } = classData;
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleExploreClick = () => {
    navigate(`/home/${subject}`);
  };
  

  const handleDelete = async () => {
    try {
      const response = await fetch(`${URL}/class/delete/${classData._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (response.ok) {
        console.log("Deleted successfully");
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.classCodes ) {
          userData.classCodes = userData.classCodes.filter(code => code !== classData.code);
          console.log(userData.classCodes)
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } else {
        console.log("Delete failed");
      }
    } catch (error) {
      console.log(error);
    }
    window.location.reload();
  };

  return (
    <div className="group relative overflow-hidden bg-white text-gray-700 shadow-lg rounded-2xl p-6 w-full h-full transform transition duration-500 hover:scale-105 hover:shadow-2xl hover:text-black">
      <div className="absolute -top-10 -right-10 bg-blue-500 w-28 h-28 rounded-full transform transition-all duration-300 group-hover:scale-150"></div>
      <div className="relative z-10 flex flex-col justify-end">
        <h3 className="text-xl sm:text-2xl font-bold mb-3 transform transition duration-300 group-hover:translate-x-3">
          {subject}
        </h3>
        <p className="text-sm mb-8 transform transition duration-300 group-hover:translate-x-3 line-clamp-3">
          Discover the wonders of {subject}. Our comprehensive curriculum covers
          key concepts, practical applications, and cutting-edge developments.
          Engage with interactive lessons and real-world examples to deepen your
          understanding.
        </p>
        <div className="flex justify-between mt-auto">
          <button
            onClick={handleExploreClick}
            className="bg-blue-500 text-white px-4 sm:px-6 py-2 rounded-md font-semibold transform transition duration-300 hover:bg-blue-600 hover:scale-105 group-hover:translate-x-3"
          >
            Explore
          </button>
          {user && user.type==="teacher" && <button onClick={handleDelete}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="darkred"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500 transform transition-all duration-300 group-hover:h-4"></div>
    </div>
  );
};

export default Card;
