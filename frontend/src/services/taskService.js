import api from './api';

const getTasks = async (filters = {}) => {
  // Convert filter object to query string
  const queryParams = new URLSearchParams();
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.priority) queryParams.append('priority', filters.priority);
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.projectId) queryParams.append('projectId', filters.projectId);

  const response = await api.get(`/tasks?${queryParams.toString()}`);
  return response.data;
};

const getTaskById = async (id) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data;
};

const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

const taskService = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};

export default taskService;
