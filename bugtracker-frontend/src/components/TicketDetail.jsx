import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TicketService from "../services/ticket.service";
import CommentService from "../services/comment.service";
import ProjectService from "../services/project.service"; // Import ProjectService
import AuthService from "../services/auth.service";
import { toast } from "react-toastify";

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]); // State for members
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    retrieveTicket();
    retrieveComments();
  }, [id]);

  const retrieveTicket = async () => {
    try {
      const response = await TicketService.getTicketById(id);
      setTicket(response.data);
      if (response.data && response.data.project) {
        retrieveProjectMembers(response.data.project.id);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load ticket");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const retrieveProjectMembers = async (projectId) => {
    try {
      const response = await ProjectService.getProjectById(projectId);
      // Assuming response.data.members is available.
      if (response.data.members) {
        setProjectMembers(response.data.members);
      }
    } catch (error) {
      console.error("Failed to load project members", error);
    }
  }

  const retrieveComments = async () => {
    try {
      const response = await CommentService.getComments(id);
      setComments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAssigneeChange = async (e) => {
    const newAssignee = e.target.value;
    if (!newAssignee) return;

    try {
      await TicketService.updateTicket(ticket.id, { assigneeUsername: newAssignee });
      toast.success("Assignee updated");
      retrieveTicket(); // Reload ticket to show new assignee details
    } catch (error) {
      console.error(error);
      toast.error("Failed to update assignee");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await CommentService.addComment(id, newComment);
      setNewComment("");
      retrieveComments();
      toast.success("Comment added");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add comment");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!ticket) return <div className="p-4">Ticket not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{ticket.title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${ticket.status === 'DONE' ? 'bg-green-600' :
              ticket.status === 'IN_PROGRESS' ? 'bg-blue-600' :
                ticket.status === 'TODO' ? 'bg-gray-500' : 'bg-yellow-500'
            }`}>
            {ticket.status}
          </span>
        </div>
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{ticket.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 border-t pt-4">
          <div>
            <span className="font-semibold">Priority:</span> {ticket.priority}
          </div>
          <div>
            <span className="font-semibold">Due Date:</span> {ticket.dueDate}
          </div>
          <div>
            <span className="font-semibold block mb-1">Assignee:</span>
            <select
              className="border rounded px-2 py-1"
              value={ticket.assignee ? ticket.assignee.username : ""}
              onChange={handleAssigneeChange}
            >
              <option value="">Unassigned</option>
              {projectMembers.map(member => (
                <option key={member.id} value={member.username}>{member.username}</option>
              ))}
            </select>
          </div>
          <div>
            <span className="font-semibold">Reporter:</span> {ticket.reporter ? ticket.reporter.username : "Unknown"}
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Comments</h3>

        <div className="space-y-4 mb-6">
          {comments.length === 0 ? (
            <p className="text-gray-500 italic">No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span className="font-semibold text-indigo-600">{comment.author ? comment.author.username : "User"}</span>
                  <span>{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-gray-800">{comment.content}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleCommentSubmit}>
          <textarea
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            rows="3"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <div className="mt-2 text-right flex justify-between">
            {ticket.reporter && AuthService.getCurrentUser().id === ticket.reporter.id && (
              <button
                type="button"
                onClick={async () => {
                  if (window.confirm("Delete this ticket?")) {
                    try {
                      await TicketService.deleteTicket(ticket.id);
                      toast.success("Ticket deleted");
                      navigate("/dashboard");
                    } catch (e) {
                      toast.error("Failed to delete");
                    }
                  }
                }}
                className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700"
              >
                Delete Ticket
              </button>
            )}
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Post Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketDetail;
