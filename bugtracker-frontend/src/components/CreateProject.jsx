import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ProjectService from '../services/project.service';
import { toast } from 'react-toastify';
import { FaPlus, FaTimes } from 'react-icons/fa';

const CreateProject = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [members, setMembers] = useState([]);
    const [memberInput, setMemberInput] = useState('');
    const navigate = useNavigate();

    const handleAddMember = (e) => {
        e.preventDefault();
        if (memberInput.trim() && !members.includes(memberInput.trim())) {
            setMembers([...members, memberInput.trim()]);
            setMemberInput('');
        }
    };

    const handleRemoveMember = (memberToRemove) => {
        setMembers(members.filter(member => member !== memberToRemove));
    };

    const onSubmit = (data) => {
        const projectData = {
            ...data,
            members: members
        };

        ProjectService.createProject(projectData.name, projectData.description, projectData.members).then(
            (response) => {
                toast.success("Project created successfully!");
                navigate("/dashboard");
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                toast.error(resMessage);
            }
        );
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Project</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Project Name
                    </label>
                    <input
                        type="text"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
                        id="name"
                        {...register("name", { required: "Project name is required" })}
                    />
                    {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="description"
                        rows="4"
                        {...register("description")}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Add Members (Usernames)
                    </label>
                    <div className="flex mb-2">
                        <input
                            type="text"
                            value={memberInput}
                            onChange={(e) => setMemberInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddMember(e);
                                }
                            }}
                            className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Type username and press Enter"
                        />
                        <button
                            type="button"
                            onClick={handleAddMember}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
                        >
                            <FaPlus />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {members.map((member, index) => (
                            <div key={index} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 flex items-center">
                                {member}
                                <button type="button" onClick={() => handleRemoveMember(member)} className="ml-2 text-red-500 hover:text-red-700 focus:outline-none">
                                    <FaTimes size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Create Project
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProject;
