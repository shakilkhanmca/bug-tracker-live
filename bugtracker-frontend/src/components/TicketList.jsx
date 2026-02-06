import React, { useEffect, useState } from "react";
import TicketService from "../services/ticket.service";
import ProjectService from "../services/project.service";
import { Link, useParams } from "react-router-dom";
import { HiArrowLeft } from 'react-icons/hi';

const TicketList = () => {
  const { projectId } = useParams();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(projectId || null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId) {
      retrieveProjects();
    } else {
      setSelectedProject(projectId);
      retrieveTickets(projectId);
    }
  }, [projectId]);

  const retrieveProjects = async () => {
    try {
      const response = await ProjectService.getMyProjects();
      console.log("Projects loaded:", response.data);
      setProjects(response.data);
      if (response.data.length > 0) {
        if (!projectId) {
          setSelectedProject(response.data[0].id);
          retrieveTickets(response.data[0].id);
        }
      } else {
        console.warn("No projects found for user.");
      }
    } catch (error) {
      console.error("Failed to load projects", error);
    }
  };

  const retrieveTickets = async (id) => {
    setLoading(true);
    try {
      const response = await TicketService.getTicketsByProject(id);
      setTickets(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const status = e.target.status.value;
    setLoading(true);
    try {
      const response = await TicketService.searchTickets(selectedProject, title, status);
      setTickets(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleProjectChange = (e) => {
    const id = e.target.value;
    setSelectedProject(id);
    retrieveTickets(id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          {projectId && (
            <Link to="/dashboard" className="mr-4 text-gray-600 hover:text-gray-900">
              <HiArrowLeft className="w-6 h-6" />
            </Link>
          )}
          <h2 className="text-2xl font-bold text-gray-800">
            {projectId ? "Project Tickets" : "My Tickets"}
          </h2>
        </div>
        <Link to={projectId ? `/dashboard/create-ticket?projectId=${projectId}` : "/dashboard/create-ticket"} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Create Ticket
        </Link>
      </div>

      {!projectId && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Project</label>
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={selectedProject || ""}
            onChange={handleProjectChange}
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="bg-white p-4 rounded-md shadow mb-6">
        <form onSubmit={handleSearch} className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">Search Title</label>
            <input type="text" name="title" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select name="status" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
              <option value="">All</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Filter</button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading tickets...</div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {tickets.length === 0 ? (
              <li className="px-4 py-4 sm:px-6 text-gray-500">No tickets found for this project.</li>
            ) : (tickets.map((ticket) => (
              <li key={ticket.id}>
                <Link to={`/dashboard/ticket/${ticket.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium text-indigo-600">{ticket.title}</p>
                      <div className="ml-2 flex flex-shrink-0">
                        <p className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${ticket.status === 'DONE' ? 'bg-green-100 text-green-800' :
                          ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                          {ticket.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {ticket.priority} Priority
                        </p>
                        <p className="flex items-center text-sm text-gray-500 ml-4">
                          Assignee: {ticket.assignee ? ticket.assignee.username : 'Unassigned'}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Due: <time dateTime={ticket.dueDate}>{ticket.dueDate}</time>
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            )))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TicketList;
