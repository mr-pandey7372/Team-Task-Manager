import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const TaskCard = ({ task }) => {
  const priorityColors = {
    Low: 'text-green-600 bg-green-50',
    Medium: 'text-yellow-600 bg-yellow-50',
    High: 'text-red-600 bg-red-50',
  };

  return (
    <Link to={`/tasks/${task._id}`} className="block">
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{task.title}</h3>
          <StatusBadge status={task.status} />
        </div>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>
        
        <div className="flex items-center justify-between text-xs mt-4">
          <div className="flex flex-col space-y-1">
            <span className="text-gray-500">Project: <span className="font-medium text-gray-700">{task.projectId?.name || 'N/A'}</span></span>
            <span className="text-gray-500">Assignee: <span className="font-medium text-gray-700">{task.assignedTo?.name || 'Unassigned'}</span></span>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            {task.dueDate && (
              <span className="text-gray-400">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TaskCard;
