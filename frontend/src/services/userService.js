import api from './api';

const getUsers = async (params = {}) => {
  const response = await api.get('/auth/users', { params });
  return response.data;
};

const userService = {
  getUsers,
};

export default userService;
