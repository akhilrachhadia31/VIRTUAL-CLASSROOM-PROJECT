import React, { useEffect, useState } from "react";
import { URL } from "../../../constant";
import { Link } from "react-router-dom";

const AssignmentView = ({ subject }) => {
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);

  const fetchDetails = async () => {
    try {
      const response = await fetch(`${URL}/assignments/details/${subject}`);
      if (!response.ok) {
        throw new Error(`HTTP error fetching details: ${response.status}`);
      }
      const data = await response.json();
      setStudents(data.students);
      setAssignments(data.assignments);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [subject]);

  const getSubmissionStatus = (assignment, studentId) => {
    const submission = assignment.submission.find(
      (sub) => sub.student === studentId
    );
    const submitDate = submission ? new Date(submission.submitdate) : null;
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();

    if (submitDate) {
      return submitDate > dueDate ? "Submitted late" : "Submitted";
    } else {
      return now > dueDate ? "Late Submission" : "No Submission";
    }
  };

  const downloadWork = (assignment, studentId) => {
    const submission = assignment.submission.find(
      (sub) => sub.student === studentId
    );
    return submission ? submission.work : false;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-300">
        Assignment Submissions
      </h1>
      <div className="overflow-x-auto">
        {assignments.length !== 0 && <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left font-semibold text-gray-600 border-b">
                Student
              </th>
              {assignments.map((assignment) => (
                <th
                  key={assignment._id}
                  className="py-3 px-4 text-left font-semibold text-gray-600 border-b"
                >
                  {assignment.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{student.username}</td>
                {assignments.map((assignment) => (
                  <td
                    key={`${student._id}-${assignment._id}`}
                    className="py-3 px-4 border-b"
                  >
                    <Link
                      to={downloadWork(assignment, student._id)}
                      target={downloadWork(assignment, student._id) && "_blank"}
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${
                          getSubmissionStatus(assignment, student._id) ===
                          "Submitted"
                            ? "bg-green-100 text-green-800"
                            : getSubmissionStatus(assignment, student._id) ===
                                "Late Submission"
                              ? "bg-red-100 text-red-800"
                              : getSubmissionStatus(assignment, student._id) ===
                                  "Submitted late"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {getSubmissionStatus(assignment, student._id)}
                    </Link>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>}
      </div>
    </div>
  );
};

export default AssignmentView;
