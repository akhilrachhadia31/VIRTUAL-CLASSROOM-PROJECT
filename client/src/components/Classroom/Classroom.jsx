import React, { useEffect, useState } from "react";
import Card from "../common/Card/Card.jsx";
import { useAuth } from "../../hooks/AuthContext.jsx";
import { URL } from "../../constant.js";
import Form from "../common/Form/Form.jsx";

const Classroom = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode,setSubjectCode] = useState("");
  
  const fetchClasses =   async () => {
    if (!user) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${URL}/class/student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ codes: user.classCodes }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch classes");
      }
      
      const data = await response.json();
      setClasses(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setError("Failed to load classes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchClasses();
  }, [user,loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${URL}/class`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          code: subjectCode,
          subject: subjectName,
          user: user,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && data) {
          userData.classCodes.push(data.code);
          localStorage.setItem('user', JSON.stringify(userData));
        }
        
      setClasses((prevClasses) => [...prevClasses, data]);
    } catch (error) {
      console.log(error);
      alert("Failed to create class: " + error.message);
    }
    await fetchClasses();
    setOpen(false);
    setSubjectName("");
    window.location.reload();
  };

  const fields = [
    {
      id: "teacher",
      label: "Teacher",
      type: "text",
      placeholder: "",
      value: user?.username || "",
      onChange: () => {},
      required: true,
      disabled: true,
    },
    {
      id: "subject",
      label: "Subject",
      type: "text",
      placeholder: "Enter subject name",
      value: subjectName,
      onChange: (value) => setSubjectName(value),
      required: true,
      disabled: false,
    },
    {
      id: "code",
      label: "code",
      type: "text",
      placeholder: "Enter subject code of size 10",
      value: subjectCode,
      onChange: (value) => setSubjectCode(value),
      required: true,
      disabled: false,
    },
  ];

  if (!user) {
    return <div>Please join the classes to view or referesh</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log(classes);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 rounded-lg shadow-inner">
      {classes.length !== 0 && classes.map((classItem) => ( 
        classItem !== null && <Card key={classItem._id} classData={classItem} />
      ))}

      {user.type === "teacher" && (
        <button
          className="fixed bottom-12 right-12 bg-teal-500 hover:bg-teal-600 p-4 text-xl min-w-[40px] rounded-md font-bold cursor-pointer transition-all duration-300 ease-in-out flex justify-center items-center leading-none"
          onClick={() => setOpen(true)}
        >
          Add Class
        </button>
      )}
      {open && (
        <Form
          title="Enter Class Details"
          fields={fields}
          onSubmit={handleSubmit}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default Classroom;
