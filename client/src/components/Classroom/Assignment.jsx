import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/AuthContext";
import { URL } from "../../constant";
import { storage } from "../../firebase/firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Calendar, Upload, CheckCircle, Maximize, Minimize } from "lucide-react";

const Assignment = ({ assignment }) => {
  const [file, setFile] = useState(null);
  const { user } = useAuth();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const pdfViewerRef = useRef(null);
  const iframeRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setIsSubmitted(
      assignment.submission.some((sub) => sub.student === user._id)
    );

    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
      if (iframeRef.current) {
        iframeRef.current.style.height = document.fullscreenElement
          ? "100vh"
          : "400px";
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [assignment.submission, user._id]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setIsUploading(true);
      try {
        const storageRef = ref(storage, "/documents/" + selectedFile.name);
        const snapshot = await uploadBytes(storageRef, selectedFile);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        setFile(downloadUrl);
        setIsUploading(false);
        return true;
      } catch (error) {
        console.error("Error uploading file:", error);
        setIsUploading(false);
        return false;
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!assignment?._id) {
      console.error("Assignment or assignment ID is missing");
      alert("Assignment information is missing. Please try again.");
      return;
    }

    try {
      const response = await fetch(
        `${URL}/assignments/${assignment._id}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ user, file, assignmentId: assignment._id }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit assignment");
      }

      const result = await response.json();
      setIsSubmitted(true);
      setFile(null);
      console.log("Assignment submitted successfully:", result);
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert(`Error submitting assignment: ${error.message}`);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      pdfViewerRef.current?.requestFullscreen().catch((err) => {
        alert(`Error enabling full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-8 overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-3/5 p-8 space-y-6">
          <h2 className="text-3xl font-extrabold text-indigo-900 border-b pb-2">
            {assignment.title}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {assignment.description}
          </p>
          <div className="flex items-center text-lg font-semibold text-indigo-600">
            <Calendar className="mr-2" />
            <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
          </div>
          {isSubmitted && (
            <div className="flex items-center text-lg text-green-600 bg-green-100 p-3 rounded-lg">
              <CheckCircle className="mr-2" />
              Assignment submitted successfully!
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="file"
                id="file"
                className="hidden"
                onChange={handleFileChange}
                required
              />
              <label
                htmlFor="file"
                className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              >
                <Upload className="mr-2" />
                {file ? "File uploaded" : "Upload your file"}
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-bold py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-indigo-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitted || isUploading || !file}
            >
              {isUploading ? "Uploading..." : "Submit Assignment"}
            </button>
          </form>
        </div>
        <div className="lg:w-2/5 p-6 bg-gray-100">
          {assignment.files?.[0] && (
            <div
              ref={pdfViewerRef}
              className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <iframe
                ref={iframeRef}
                src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(assignment.files[0])}`}
                width="100%"
                height="400px"
                className="border-none"
              ></iframe>
              <button
                onClick={toggleFullScreen}
                className="absolute bottom-4 right-4 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assignment;