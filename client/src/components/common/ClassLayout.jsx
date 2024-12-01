import React, { useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/AuthContext";
import AnnouncementSection from "../Classroom/AnnouncementSection";
import Form from "./Form/Form";
import { BookOpen, ClipboardList, Archive, Megaphone } from "lucide-react";
import LectureSection from "../Classroom/Lectures";
import AssignmentSection from "../Classroom/AssignmentSection";
import MaterialSection from "../Classroom/MaterialSection";
import { URL } from "../../constant";

const ClassSection = () => {
  const { user, isLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const subject = useParams().subject;
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${URL}/announcement/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, content, subject, user }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      setOpen(false);
      setTitle("");
      setContent("");
      setUpdateTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error creating announcement:", error.message);
    }
  };

  const fields = [
    { id: "title", label: "Title", type: "text", value: title, onChange: setTitle },
    { id: "content", label: "Content", type: "textarea", value: content, onChange: setContent },
  ];

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const sectionItems = [
    { name: "Lessons", icon: BookOpen, description: "Access course lectures" },
    { name: "Assignments", icon: ClipboardList, description: "View and submit assignments" },
    { name: "Materials", icon: Archive, description: "Access course resources" },
  ];

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <motion.h1 
        className="text-4xl font-bold text-center mb-12 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {subject} Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {sectionItems.map((item, index) => (
          <motion.div
            key={item.name}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/home/${subject}/${item.name.toLowerCase()}`} className="block w-full h-full">
              <motion.div 
                className="bg-white text-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-12 h-12 mx-auto mb-4 text-teal-500 group-hover:text-teal-600" />
                <h2 className="text-2xl font-bold mb-2 group-hover:text-black">{item.name}</h2>
                <p className="group-hover:text-gray-950">{item.description}</p>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
        className="bg-gray-200 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-teal-500 p-4">
          <h2 className="text-2xl font-bold text-black text-center">Announcements</h2>
        </div>
          <AnnouncementSection subject={subject} updateTrigger={updateTrigger} />
      </motion.div>

      {user && user.type === "teacher" && (
        <motion.button
          className="fixed bottom-8 right-8 bg-red-500 text-white text-lg font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Megaphone className="w-6 h-6 mr-2" />
          Announce
        </motion.button>
      )}

      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md"
          >
            <Form
              title="Create Announcement"
              fields={fields}
              onSubmit={handleSubmit}
              onClose={() => setOpen(false)}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};


const ClassLayout = () => {
  const subject = useParams().subject;
  // console.log(subject)
  return (
    <Routes>
      <Route index element={<ClassSection />} />
      <Route path="lessons/*" element={<LectureSection subject={subject} />} />
      <Route
        path="assignments"
        element={<AssignmentSection subject={subject} />}
      />
      <Route path="materials" element={<MaterialSection subject={subject} />} />
    </Routes>
  );
};

export default ClassLayout;
