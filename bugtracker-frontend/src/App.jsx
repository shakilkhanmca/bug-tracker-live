import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import TicketList from './components/TicketList';
import CreateProject from './components/CreateProject';
import TicketDetail from './components/TicketDetail';
import KanbanBoard from "./components/KanbanBoard.jsx";
import AuthService from "./services/auth.service.js";
import CreateTicket from "./components/CreateTicket.jsx";
import ProjectList from "./components/ProjectList.jsx";

// Protected Route Wrapper
const ProtectedRoute = () => {
  const user = AuthService.getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<ProjectList />} />
            <Route path="project/:projectId" element={<TicketList />} />
            <Route path="board" element={<KanbanBoard />} />
            <Route path="ticket/:id" element={<TicketDetail />} />
            <Route path="create-ticket" element={<CreateTicket />} />
            <Route path="create-project" element={<CreateProject />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

export default App;
