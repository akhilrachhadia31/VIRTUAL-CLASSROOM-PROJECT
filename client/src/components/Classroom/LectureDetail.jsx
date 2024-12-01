import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Form from "../common/Form/Form";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { URL } from "../../constant";
import { useAuth } from "../../hooks/AuthContext";
import { BookOpen, Clock, Trash2, PlusCircle, X } from "lucide-react";


const Alert = ({ children, variant }) => (
  <div className={`p-4 rounded-md ${variant === 'destructive' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
    {children}
  </div>
);

const AlertTitle = ({ children }) => (
  <h3 className="font-bold mb-2">{children}</h3>  
);

const AlertDescription = ({ children }) => (
  <p>{children}</p>
);

const LectureDetail = () => {
  const lessonIdString = useParams().lectureId;
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchLectures = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${URL}/resource/${lessonIdString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch lectures");
      const data = await response.json();
      setLectures(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, [lessonIdString]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lecture = {
      title,
      lessonId: lessonIdString,
      description,
      videolink: file,
    };

    try {
      const response = await fetch(`${URL}/resource`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(lecture),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setOpen(false);
      setTitle("");
      setDescription("");
      setFile(null);
      fetchLectures();
    } catch (error) {
      console.error("Error submitting lecture:", error);
      setError("Failed to submit lecture. Please try again.");
    }
  };

  const deleteLecture = async (lecture) => {
    try {
      const response = await fetch(`${URL}/resource/delete/${lecture._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ lessonId: lessonIdString }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchLectures();
      setLectures((prev) => prev.filter((lec) => lec._id !== lecture._id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      try {
        const storage = getStorage();
        const storageRef = ref(
          storage,
          "videos/LearnSpace/" + selectedFile.name
        );
        const snapshot = await uploadBytes(storageRef, selectedFile);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        console.log("File uploaded successfully. Download URL:", downloadUrl);
        setFile(downloadUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
        setError("Failed to upload file. Please try again.");
      }
    }
  };

  const fields = [
    {
      id: "title",
      label: "Title",
      type: "text",
      placeholder: "Lecture Title",
      value: title,
      onChange: setTitle,
      required: true,
      disabled: false,
    },
    {
      id: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Lecture Description",
      value: description,
      onChange: setDescription,
      required: true,
      disabled: false,
    },
    {
      id: "file",
      label: "VideoLink",
      type: "file",
      value: file,
      placeholder: "Upload the Video",
      onChange: handleFileUpload,
      disabled: false,
      required: true,
      accept: "video/*",
    },
  ];

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen bg-blue-50">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <Alert variant="destructive" className="m-4">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-8 text-center">
          <BookOpen className="inline-block mr-2 mb-1" size={36} />
          Lectures
        </h1>
        <div className="space-y-8">
          {lectures.length !== 0 ? (
            lectures.map((lecture, index) => (
              <div
                key={lecture._id}
                className="bg-white rounded-md shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="md:flex">
                  <div className="md:flex-shrink-0 w-full md:w-2/5">
                    <div className="aspect-w-16 aspect-h-9">
                      <video
                        className="w-full h-full object-cover"
                        controls
                      >
                        <source src={lecture.videolink} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                  <div className="p-8 w-full md:w-3/5">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold text-blue-800">
                        Lecture {index + 1}
                      </h2>
                      {user && user.type === "teacher" && (
                        <button
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          onClick={() => deleteLecture(lecture)}
                        >
                          <Trash2 size={24} />
                        </button>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      {lecture.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {lecture.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-2" size={18} />
                      Posted on {new Date(lecture.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-600 text-lg italic">
                No lectures available yet. Start adding some educational content!
              </p>
            </div>
          )}
        </div>
        {user && user.type === "teacher" && (
          <div className="fixed bottom-10 right-10">
            <button
              className="bg-teal-500 hover:bg-teal-600 text-white text-lg font-semibold py-3 px-6 rounded-md shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out flex items-center"
              onClick={() => setOpen(true)}
            >
              <PlusCircle className="mr-2" size={24} />
              Add Lecture
            </button>
            {open && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-blue-800">Enter Lecture Details</h2>
                    <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">
                      <X size={24} />
                    </button>
                  </div>
                  <Form
                    title="Add Lecture"
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
    </div>
  );
};

export default LectureDetail;