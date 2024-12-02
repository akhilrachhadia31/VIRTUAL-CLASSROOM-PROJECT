import React from "react";
import Navbar from "../Navigation/Navbar.jsx";
import Sidebar from "../Navigation/Sidebar.jsx";
import { Route, Routes } from "react-router-dom";
import Classroom from "../Classroom/Classroom.jsx";
import Class from "../../pages/ClassPage.jsx";
import EmailSend from "../../pages/EmailSend.jsx";
import { useAuth } from "../../hooks/AuthContext.jsx";

const HomeLayout = () => {
  const { user } = useAuth();
  return (
    <div className="h-screen w-full flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-grow bg-gray-900 overflow-auto">
          <Routes>
            <Route index element={<Classroom />} />
            <Route path=":subject/*" element={<Class />} />
            {user && user.type === "teacher" && (
              <Route path="/sendmails" element={<EmailSend />} />
            )}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;
