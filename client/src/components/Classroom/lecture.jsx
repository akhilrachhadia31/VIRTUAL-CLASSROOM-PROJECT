import React from "react";
import { Calendar, ChevronRight } from "lucide-react";

const Lesson = ({ lecture }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-4 flex justify-between items-center group hover:bg-indigo-50 transition-all duration-300 rounded-lg">
      <div className="flex-grow">
        <h2 className="text-xl font-semibold text-indigo-900 group-hover:text-indigo-600 transition-colors duration-300">
          {lecture.title}
        </h2>
        <div className="flex items-center mt-2 text-gray-600 group-hover:text-indigo-500 transition-colors duration-300">
          <Calendar size={16} className="mr-2" />
          <p className="text-sm">{formatDate(lecture.createdAt)}</p>
        </div>
      </div>
      <div className="flex items-center">
        <span className="text-sm font-medium text-indigo-600 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          View Lesson
        </span>
        <ChevronRight 
          size={24} 
          className="text-indigo-400 group-hover:text-indigo-600 transform group-hover:translate-x-1 transition-all duration-300" 
        />
      </div>
    </div>
  );
};

export default Lesson;