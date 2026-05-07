const ProjectCard = ({ project, isAdmin, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">{project.name}</h3>
        {isAdmin && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(project)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(project._id)}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <p className="text-gray-600 mb-4">{project.description}</p>
      
      <div className="mt-4 border-t pt-4">
        <p className="text-sm font-semibold text-gray-700">Team Members:</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.teamMembers && project.teamMembers.length > 0 ? (
            project.teamMembers.map((member) => (
              <span
                key={member._id}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {member.name}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500">No members assigned</span>
          )}
        </div>
      </div>
      <div className="mt-4 text-xs text-gray-400">
        Created by: {project.createdBy?.name} on {new Date(project.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default ProjectCard;
