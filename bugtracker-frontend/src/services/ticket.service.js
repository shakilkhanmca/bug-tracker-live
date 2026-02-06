import api from "./api";

const createTicket = (ticketData) => {
  return api.post("/tickets", ticketData);
};

const getTicketsByProject = (projectId) => {
  return api.get(`/tickets/project/${projectId}`);
};

const updateTicket = (id, ticketData) => {
  return api.put(`/tickets/${id}`, ticketData);
};

const deleteTicket = (id) => {
  return api.delete(`/tickets/${id}`);
};

const searchTickets = (projectId, title, status) => {
    const params = new URLSearchParams();
    if(projectId) params.append('projectId', projectId);
    if(title) params.append('title', title);
    if(status) params.append('status', status);
    
    return api.get(`/tickets/search?${params.toString()}`);
}

const TicketService = {
  createTicket,
  getTicketsByProject,
  updateTicket,
  deleteTicket,
  searchTickets
};

export default TicketService;
