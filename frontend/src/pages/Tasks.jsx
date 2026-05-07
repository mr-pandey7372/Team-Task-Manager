import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import taskService from '../services/taskService';
import TaskCard from '../components/TaskCard';
import TaskFilters from '../components/TaskFilters';
import TaskForm from '../components/TaskForm';
import Spinner from '../components/Spinner';

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const isAdmin = user?.role === 'Admin';

  const fetchTasks = async (filters = {}) => {
    try {
      setIsLoading(true);
      const data = await taskService.getTasks(filters);
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (formData) => {
    try {
      await taskService.createTask(formData);
      setShowCreateForm(false);
      fetchTasks(); // refresh
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          {isAdmin && !showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium"
            >
              + New Task
            </button>
          )}
        </div>

        {showCreateForm ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8 max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Create New Task</h2>
            <TaskForm onSubmit={handleCreateTask} onCancel={() => setShowCreateForm(false)} />
          </div>
        ) : (
          <>
            <TaskFilters onFilterChange={fetchTasks} />

            {isLoading ? (
              <Spinner />
            ) : tasks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-500 text-lg">No tasks found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Tasks;
