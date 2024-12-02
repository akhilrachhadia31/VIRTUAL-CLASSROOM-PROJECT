import React, { useEffect, useReducer } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { URL } from "../constant";

const initialState = {
  students: [],
  selectedStudents: [],
  emailSubject: "",
  emailBody: "",
  isSending: false,
  status: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_STUDENTS":
      return { ...state, students: action.payload };
    case "SELECT_STUDENT":
      return {
        ...state,
        selectedStudents: state.selectedStudents.includes(action.payload)
          ? state.selectedStudents.filter((email) => email !== action.payload)
          : [...state.selectedStudents, action.payload],
      };
    case "SELECT_ALL":
      return {
        ...state,
        selectedStudents:
          state.selectedStudents.length === state.students.length
            ? []
            : state.students.map((student) => student.email),
      };
    case "SET_EMAIL_SUBJECT":
      return { ...state, emailSubject: action.payload };
    case "SET_EMAIL_BODY":
      return { ...state, emailBody: action.payload };
    case "SET_SENDING":
      return { ...state, isSending: action.payload };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "RESET_FORM":
      return {
        ...state,
        selectedStudents: [],
        emailSubject: "",
        emailBody: "",
        status: "",
      };
    default:
      return state;
  }
};

const EmailSend = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchDetails = async () => {
    try {
      const response = await fetch(`${URL}/user`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      dispatch({ type: "SET_STUDENTS", payload: data });
    } catch (error) {
      console.error("Error fetching students:", error);
      dispatch({ type: "SET_STATUS", payload: "Failed to fetch students" });
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleSelectStudent = (email) => {
    dispatch({ type: "SELECT_STUDENT", payload: email });
  };

  const handleSelectAll = () => {
    dispatch({ type: "SELECT_ALL" });
  };

  const sendEmails = async (e) => {
    e.preventDefault();
    dispatch({ type: "SET_SENDING", payload: true });
    dispatch({ type: "SET_STATUS", payload: "Sending emails..." });

    try {
      const response = await fetch(`${URL}/sendemail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          to: state.selectedStudents,
          subject: state.emailSubject,
          text: state.emailBody,
          html: `<p>${state.emailBody}</p>`,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      dispatch({ type: "SET_STATUS", payload: "Emails sent successfully!" });
      dispatch({ type: "RESET_FORM" });
    } catch (error) {
      console.error("Error sending emails:", error);
      dispatch({ type: "SET_STATUS", payload: "Failed to send emails" });
    } finally {
      dispatch({ type: "SET_SENDING", payload: false });
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-6">Send Email to Students</h1>
      <form onSubmit={sendEmails}>
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subject:
          </label>
          <div className="flex items-center">
            <Mail className="mr-2 text-gray-500" />
            <input
              type="text"
              id="subject"
              value={state.emailSubject}
              onChange={(e) =>
                dispatch({ type: "SET_EMAIL_SUBJECT", payload: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </motion.div>

        <motion.div
          className="mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <label
            htmlFor="body"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Body:
          </label>
          <textarea
            id="body"
            value={state.emailBody}
            onChange={(e) =>
              dispatch({ type: "SET_EMAIL_BODY", payload: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            required
          />
        </motion.div>

        <motion.div
          className="mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {state.selectedStudents.length === state.students.length
              ? "Deselect All"
              : "Select All"}
          </button>
        </motion.div>

        <motion.div
          className="mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <label
            htmlFor="students"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Students:
          </label>
          <div
            id="students"
            className="space-y-2 max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2"
          >
            {state.students.map((student) => (
              <div key={student._id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={state.selectedStudents.includes(student.email)}
                  onChange={() => handleSelectStudent(student.email)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{student.email}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.button
          type="submit"
          disabled={state.isSending || state.selectedStudents.length === 0}
          className={`w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${state.isSending || state.selectedStudents.length === 0
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
            }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {state.isSending ? "Sending..." : "Send Emails"}
        </motion.button>
      </form>

      {state.status && (
        <motion.p
          className="mt-4 text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {state.status.includes("successfully") ? (
            <CheckCircle className="inline-block mr-1 text-green-500" />
          ) : (
            <AlertCircle className="inline-block mr-1 text-red-500" />
          )}
          {state.status}
        </motion.p>
      )}
    </motion.div>
  );
};

export default EmailSend;
