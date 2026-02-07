import api from "./api";

// LocalStorage से टोकन निकालने के लिए हेल्पर फंक्शन
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  // आपके Local Storage में 'token' नाम की की (key) है, इसलिए यहाँ user.token लिखा है
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    console.warn("No token found in localStorage");
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
