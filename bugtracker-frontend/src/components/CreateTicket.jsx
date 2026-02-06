import React, { useState, useEffect } from "react";
import TicketService from "../services/ticket.service";
import ProjectService from "../services/project.service";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const CreateTicket = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedProjectId = searchParams.get("projectId");

  const [projects, setProjects] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [ticket, setTicket] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "TODO",
    dueDate: "",
    projectId: preSelectedProjectId || "",
    assigneeUsername: ""
  });

  useEffect(() => {
    retrieveProjects();
  }, []);

  useEffect(() => {
    if (ticket.projectId && projects.length > 0) {
      const selectedProject = projects.find(p => p.id === Number(ticket.projectId));
      if (selectedProject && selectedProject.members) {
        setProjectMembers(selectedProject.members);
      } else {
        setProjectMembers([]);
      }
    }
  }, [ticket.projectId, projects]);

  const retrieveProjects = async () => {
    try {
      const response = await ProjectService.getMyProjects();
      setProjects(response.data);
      setTicket(prev => {
        if (!prev.projectId && response.data.length > 0) {
          return { ...prev, projectId: response.data[0].id };
        }
        return prev;
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket({ ...ticket, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await TicketService.createTicket(ticket);
      toast.success("Ticket created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create ticket");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Create New Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700">Project</label>
          <select
            name="projectId"
            value={ticket.projectId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            required
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={ticket.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            rows={3}
            value={ticket.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              name="priority"
              value={ticket.priority}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={ticket.dueDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Assign To</label>
          <select
            name="assigneeUsername"
            value={ticket.assigneeUsername}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
          >
            <option value="">Select Assignee (Optional)</option>
            {projectMembers.map((member) => (
              <option key={member.id} value={member.username}>
                {member.username} ({member.email})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Ticket
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;
