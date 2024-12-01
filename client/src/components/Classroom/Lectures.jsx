import React, { useEffect, useState, useCallback } from "react";
import { URL } from "../../constant";
import Form from "../common/Form/Form";
import { Link, Route, Routes } from "react-router-dom";
import LectureDetail from "./LectureDetail.jsx";
import Lesson from "./lecture";
import { useAuth } from "../../hooks/AuthContext.jsx";

const Lectures = ({ subject }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lectures, setLectures] = useState([]);
  const [title, setTitle] = useState("");
  const { user } = useAuth();

  const fetchLectures = useCallback(async () => {
    try {
      const response = await fetch(`${URL}/lectures`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ subject }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLectures(data);
    } catch (error) {
      console.error("There was a problem fetching the lectures:", error);
    } finally {
      setIsLoading(false);
    }
  }, [subject]);

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${URL}/lectures/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, subject }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      await fetchLectures();
      setOpen(false);
      setTitle("");
    } catch (error) {
      console.error("Error uploading lecture:", error);
      alert("Failed to upload lecture. Please try again.");
    }
  };

  const fields = [
    {
      id: "subject",
      label: "Class",
      type: "text",
      placeholder: "Subject",
      value: subject,
      onChange: null,
      required: true,
      disabled: true,
    },
    {
      id: "title",
      label: "Title",
      type: "text",
      placeholder: "Class Title",
      value: title,
      onChange: setTitle,
      required: true,
      disabled: false,
    },
  ];

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-5xl font-extrabold text-indigo-900 mb-10 text-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
          Lessons
        </span>
      </h1>
      <div className="max-w-4xl mx-auto space-y-6">
        {lectures.length > 0 ? (
          lectures.map((lecture) => (
            <Link
              key={lecture._id}
              to={`/home/${subject}/lessons/${lecture._id}`}
              className="block bg-white shadow-md hover:shadow-xl rounded-xl overflow-hidden transition-all duration-100 transform hover:-translate-y-1"
            >
              <div className="border-l-8 border-indigo-400 pl-6 py-6 pr-4">
                <Lesson lecture={lecture} />
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center text-gray-600 text-lg italic bg-white p-8 rounded-xl shadow-md">
            <svg className="mx-auto h-16 w-16 text-indigo-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p>This class has no lessons yet.</p>
          </div>
        )}
      </div>
      {user.type === "teacher" && (
        <div className="fixed bottom-10 right-10">
          <button
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out flex items-center"
            onClick={() => setOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Lesson
          </button>
          {open && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <Form
                  title="Enter Lesson Details"
                  fields={fields}
                  onSubmit={handleSubmit}
                  onClose={() => setOpen(false)}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const LectureSection = ({ subject }) => (
  <Routes>
    <Route index element={<Lectures subject={subject} />} />
    <Route path=":lectureId" element={<LectureDetail />} />
  </Routes>
);

export default LectureSection;