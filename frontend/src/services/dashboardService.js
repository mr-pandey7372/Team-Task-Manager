import api from './api';

const getDashboardStats = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

const dashboardService = {
  getDashboardStats,
};

export default dashboardService;
