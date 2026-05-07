import { useState, useEffect } from 'react';
import userService from '../services/userService';

const ProjectForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teamMembers: [],
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        teamMembers: initialData.teamMembers?.map((m) => m._id) || [],
      });
    }

    const fetchUsers = async () => {
      try {
        const data = await userService.getUsers({ action: 'createProject' });
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };
    fetchUsers();
  }, [initialData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleMemberToggle = (userId) => {
    setFormData((prev) => {
      const isSelected = prev.teamMembers.includes(userId);
      if (isSelected) {
        return {
          ...prev,
          teamMembers: prev.teamMembers.filter((id) => id !== userId),
        };
      } else {
        return {
          ...prev,
          teamMembers: [...prev.teamMembers, userId],
        };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Project Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="3"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
        <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2 space-y-2">
          {users.map((user) => (
            <div key={user._id} className="flex items-center">
              <input
                id={`user-${user._id}`}
                type="checkbox"
                checked={formData.teamMembers.includes(user._id)}
                onChange={() => handleMemberToggle(user._id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`user-${user._id}`} className="ml-2 block text-sm text-gray-900">
                {user.name} ({user.email}) - {user.role}
              </label>
            </div>
          ))}
          {users.length === 0 && <p className="text-sm text-gray-500">No users found.</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {initialData ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
