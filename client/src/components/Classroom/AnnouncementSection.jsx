import React, { useEffect, useState } from "react";
import { URL } from "../../constant";
import { useAuth } from "../../hooks/AuthContext";
import { MessageSquare, Send, X } from "lucide-react";

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const AnnouncementSection = ({ subject, updateTrigger }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);
  const { user } = useAuth();

  const handleReply = async (announcementId) => {
    if (replyContent.trim()) {
      try {
        const response = await fetch(
          `${URL}/announcement/${announcementId}/reply/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ content: replyContent, user }),
          }
        );

        if (!response.ok) {
          const errorBody = await response.text();
          console.error(
            `Failed to post reply: ${response.status} ${response.statusText}`,
            errorBody
          );
          throw new Error(
            `Failed to post reply: ${response.status} ${response.statusText}`
          );
        }

        setReplyContent("");
        setActiveReplyId(null);
        fetchData();
        window.location.reload();
      } catch (error) {
        console.error("Error posting reply:", error);
      }
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${URL}/announcement/${subject}`);
      if (!response.ok) {
        throw new Error("Failed to fetch announcements");
      }
      const data = await response.json();
      setAnnouncements(data.announcements || []);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [subject, updateTrigger]);

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
      <p className="font-bold">Error</p>
      <p>{error}</p>
    </div>
  );

  return (
    <div className="p-6">
      {announcements.length === 0 ? (
        <p className="text-center text-gray-500 italic text-lg">
          No announcements yet.
        </p>
      ) : (
        announcements.map((acemt) => (
          <div
            key={acemt._id}
            className="bg-white rounded-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black mt-5"
          >
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6">
              <h3 className="text-2xl font-bold text-white mb-2">{acemt.title}</h3>
              <div className="text-sm text-gray-300 flex items-center">
                <MessageSquare size={16} className="mr-2" />
                Posted on {formatDate(acemt.createdAt)} by {acemt.createdBy.username}
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">{acemt.content}</p>

              <div className="space-y-4 mb-6">
                {acemt.replies.map((reply, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-4 ${
                      reply.user.type === "teacher"
                        ? "bg-blue-200 border-s-[6px] border-red-500"
                        : "bg-blue-200 border-l-[6px] border-teal-400"
                    }`}
                  >
                    <p className="text-gray-900 mb-2">{reply.content}</p>
                    <div className="text-xs text-gray-950 flex items-center">
                      <span
                        className={`inline-block w-3 h-3 rounded-full mr-2 ${
                          reply.user.type === "teacher" ? "bg-blue-500" : "bg-gray-300"
                        }`}
                      ></span>
                      Replied by {reply.user.username}
                      {reply.user.type === "teacher" && (
                        <span className="ml-1 text-blue-600 font-semibold">
                          (Teacher)
                        </span>
                      )}
                      <span className="mx-2">•</span>
                      {formatDate(reply.createdAt)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                {activeReplyId === acemt._id ? (
                  <div className="space-y-3">
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write your reply..."
                      rows="3"
                    />
                    <div className="flex justify-end space-x-3">
                      <button
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300 ease-in-out flex items-center"
                        onClick={() => handleReply(acemt._id)}
                      >
                        <Send size={16} className="mr-2" />
                        Submit
                      </button>
                      <button
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300 ease-in-out flex items-center"
                        onClick={() => setActiveReplyId(null)}
                      >
                        <X size={16} className="mr-2" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="text-teal-600 hover:text-teal-800 font-semibold transition duration-300 ease-in-out flex items-center"
                    onClick={() => setActiveReplyId(acemt._id)}
                  >
                    <MessageSquare size={16} className="mr-2" />
                    Reply to this announcement
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AnnouncementSection;