import api from "./api";

// LocalStorage से टोकन निकालने के लिए एक छोटा फंक्शन
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.accessToken) {
    return { Authorization: 'Bearer ' + user.accessToken };
  } else {
    return {};
  }
};

const createTicket = (ticketData) => {
  return api.post("/tickets", ticketData, { headers: getAuthHeader() });
};

const getTicketsByProject = (projectId) => {
  return api.get(`/tickets/project/${projectId}`, { headers: getAuthHeader() });
};

const updateTicket = (id, ticketData) => {
  return api.put(`/tickets/${id}`, ticketData, { headers: getAuthHeader() });
};

const deleteTicket = (id) => {
  return api.delete(`/tickets/${id}`, { headers: getAuthHeader() });
};

const searchTickets = (projectId, title, status) => {
    const params = new URLSearchParams();
    if(projectId) params.append('projectId', projectId);
    if(title) params.append('title', title);
    if(status) params.append('status', status);
    
    return api.get(`/tickets/search?${params.toString()}`, { headers: getAuthHeader() });
}

const TicketService = {
  createTicket,
  getTicketsByProject,
  updateTicket,
  deleteTicket,
  searchTickets
};

export default TicketService;
