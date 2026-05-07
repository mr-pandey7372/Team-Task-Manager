import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import taskService from '../services/taskService';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const isAdmin = user?.role === 'Admin';
  // A member can only update status if they are the assignee
  const isAssignee = task?.assignedTo?._id === user?._id;
  const canEditStatus = isAdmin || isAssignee;

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await taskService.getTaskById(id);
        setTask(data);
        setStatus(data.status);
      } catch (error) {
        console.error('Failed to fetch task details', error);
        navigate('/tasks'); // Redirect back if not found or unauthorized
      } finally {
        setIsLoading(false);
      }
    };
    fetchTask();
  }, [id, navigate]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    try {
      await taskService.updateTask(id, { status: newStatus });
      setTask({ ...task, status: newStatus });
      toast.success('Task status updated');
    } catch (error) {
      console.error('Failed to update status', error);
      toast.error('Failed to update task status');
    }
  };

  const handleDeleteClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await taskService.deleteTask(id);
      toast.success('Task deleted successfully');
      navigate('/tasks');
    } catch (error) {
      console.error('Failed to delete task', error);
      toast.error('Failed to delete task');
    } finally {
      setIsConfirmOpen(false);
    }
  };

  if (isLoading) return <Spinner />;
  if (!task) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-5 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h1>
            <div className="flex space-x-3 items-center">
              <StatusBadge status={task.status} />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 border border-gray-200 px-2 py-0.5 rounded">
                Priority: {task.priority}
              </span>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={handleDeleteClick}
              className="text-red-600 hover:text-red-800 text-sm font-medium border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded transition"
            >
              Delete Task
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{task.description}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 space-y-5">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Project</h4>
              <p className="text-gray-900 font-medium">{task.projectId?.name || 'N/A'}</p>
            </div>
            
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Assignee</h4>
              <p className="text-gray-900 font-medium">{task.assignedTo?.name || 'Unassigned'}</p>
              {task.assignedTo && <p className="text-xs text-gray-500">{task.assignedTo.email}</p>}
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Due Date</h4>
              <p className="text-gray-900 font-medium">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date set'}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Created By</h4>
              <p className="text-gray-900 text-sm">{task.assignedBy?.name}</p>
            </div>

            {canEditStatus && (
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Update Status
                </label>
                <select
                  value={status}
                  onChange={handleStatusChange}
                  className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task forever? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default TaskDetails;
