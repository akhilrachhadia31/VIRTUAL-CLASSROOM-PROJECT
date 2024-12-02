import React, { useState, useEffect } from "react";
import { storage } from "../../firebase/firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { URL } from "../../constant";
import Form from "../common/Form/Form";
import { useAuth } from "../../hooks/AuthContext.jsx";
import { Book, Download, Upload, X } from "lucide-react";

const MaterialSection = ({ subject }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [description, setDescription] = useState("");
  const [materials, setMaterials] = useState([]);
  const { user } = useAuth();

  const fetchMaterials = async () => {
    try {
      const response = await fetch(`${URL}/materials/${subject}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setMaterials(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch materials");
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
      alert("Failed to load materials. Please try again later.");
    }
  };

  useEffect(() => {
    if (subject) {
      fetchMaterials();
    }
  }, [subject]);

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      try {
        const storageRef = ref(storage, "/documents/" + selectedFile.name);
        const snapshot = await uploadBytes(storageRef, selectedFile);
        const downloadUrl = await getDownloadURL(snapshot.ref);

        setFile(downloadUrl);
        return true;
      } catch (error) {
        console.error("Error uploading file:", error);
        return false;
      }
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const sendMaterial = await fetch(`${URL}/materials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          subject,
          title,
          description,
          file,
        }),
      });
      if (!sendMaterial.ok) {
        throw new Error(`HTTP error! status: ${sendMaterial.status}`);
      }
      await sendMaterial.json();
      fetchMaterials();
      setTitle("");
      setDescription("");
      setFile("");
      setOpen(false);
    } catch (error) {
      alert("Error: " + error);
    }
  };

  const fields = [
    {
      id: "subject",
      label: "Subject",
      type: "text",
      placeholder: "Enter subject",
      value: subject,
      onChange: null,
      required: true,
      disabled: true,
    },
    {
      id: "title",
      label: "Title",
      type: "text",
      placeholder: "Enter title",
      value: title,
      onChange: setTitle,
      required: true,
      disabled: false,
    },
    {
      id: "description",
      label: "Description",
      type: "text",
      placeholder: "Enter short description",
      value: description,
      onChange: setDescription,
      required: true,
      disabled: false,
    },
    {
      id: "file",
      label: "File",
      type: "file",
      placeholder: "Upload the material",
      onChange: handleFileUpload,
      disabled: false,
      required: true,
      accept: "application/pdf",
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-teal-400 mb-8 text-center flex items-center justify-center">
          <Book className="mr-4" size={36} />
          Study Materials for {subject}
        </h2>

        {materials.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg italic">
              No materials available for {subject} at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {materials.map((material) => (
              <div
                key={material.id}
                className="text-gray-600 mb-4 hover:text-black bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-100 transform hover:-translate-y-2"
              >
                <div className="p-6 flex flex-col h-full">
                  <h3 className="text-2xl font-bold transition-colors duration-300">
                    {material.title}
                  </h3>
                  <p className="text-gray-600 mt-4 mb-2 flex-grow">
                    {material.description}
                  </p>
                  <a
                    href={material.file}
                    className="inline-flex items-center justify-center bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                    download="material"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="mr-2" size={20} />
                    Download Material
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
        {user.type === "teacher" && (
          <button
            className="fixed bottom-8 right-8 bg-teal-500 text-white hover:bg-teal-600 text-lg py-3 px-6 rounded-md font-bold cursor-pointer transition-all duration-300 ease-in-out flex justify-center items-center shadow-lg hover:shadow-xl"
            onClick={() => setOpen(true)}
          >
            <Upload className="mr-2" size={24} />
            Upload Material
          </button>
        )}
        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Form
              title="Enter Material Details"
              fields={fields}
              onSubmit={handleSubmit}
              onClose={() => setOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialSection;