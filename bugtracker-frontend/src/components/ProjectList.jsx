import React, { useState, useEffect } from 'react';
import ProjectService from '../services/project.service';
import { Link } from 'react-router-dom';
import { HiFolder, HiPlus } from 'react-icons/hi';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        retrieveProjects();
    }, []);

    const retrieveProjects = async () => {
        try {
            const response = await ProjectService.getMyProjects();
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects", error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
                <Link to="/dashboard/create-project" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
                    <HiPlus className="mr-2" /> Create Project
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
                        <div className="flex items-center mb-4">
                            <HiFolder className="text-indigo-600 w-8 h-8 mr-3" />
                            <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
                        </div>
                        <p className="text-gray-600 mb-4 h-16 overflow-hidden text-ellipsis">{project.description}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                            <span>Members: {project.members ? project.members.length : 0}</span>
                        </div>
                        <Link
                            to={`/dashboard/project/${project.id}`}
                            className="block w-full text-center bg-indigo-50 bg-opacity-50 text-indigo-700 font-semibold py-2 rounded hover:bg-indigo-100 transition-colors"
                        >
                            View Board & Tickets
                        </Link>
                    </div>
                ))}
            </div>

            {projects.length === 0 && (
                <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">No projects found.</p>
                    <Link to="/dashboard/create-project" className="text-indigo-600 font-medium hover:underline p-4">
                        Create your first project
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ProjectList;
