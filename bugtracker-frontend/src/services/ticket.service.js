import api from "./api";

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  // ⚠️ 'token' नाम ही इस्तेमाल करना है क्योंकि तेरे ब्राउज़र में यही सेव हो रहा है
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

const TicketService = {
  createTicket: (data) => api.post("/tickets", data, { headers: getAuthHeader() }),
  getTicketsByProject: (id) => api.get(`/tickets/project/${id}`, { headers: getAuthHeader() }),
  updateTicket: (id, data) => api.put(`/tickets/${id}`, data, { headers: getAuthHeader() }),
  deleteTicket: (id) => api.delete(`/tickets/${id}`, { headers: getAuthHeader() }),
  searchTickets: (projectId, title, status) => {
    const params = new URLSearchParams({ projectId, title, status });
    return api.get(`/tickets/search?${params.toString()}`, { headers: getAuthHeader() });
  }
};

export default TicketService;
