import api from "./api";

const createProject = (name, description, members) => {
  return api.post("/projects", { name, description, members });
};

const getMyProjects = () => {
  return api.get("/projects");
};

const getProjectById = (id) => {
  return api.get(`/projects/${id}`);
};

const ProjectService = {
  createProject,
  getMyProjects,
  getProjectById,
};

export default ProjectService;
