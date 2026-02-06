import api from "./api";

const getComments = (ticketId) => {
  return api.get(`/comments/ticket/${ticketId}`);
};

const addComment = (ticketId, content) => {
  return api.post(`/comments/ticket/${ticketId}`, { content });
};

const CommentService = {
  getComments,
  addComment,
};

export default CommentService;
