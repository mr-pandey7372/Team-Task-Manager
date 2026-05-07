import { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Persist login after refresh
  useEffect(() => {
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      setUser(JSON.parse(userFromStorage));
    }
  }, []);

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const data = await authService.register(userData);
      setUser(data);
      setIsSuccess(true);
      setIsError(false);
      setMessage('');
      toast.success('Registration successful!');
    } catch (error) {
      setIsError(true);
      const errMsg = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      setMessage(errMsg);
      setIsSuccess(false);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      setIsLoading(true);
      const data = await authService.login(userData);
      setUser(data);
      setIsSuccess(true);
      setIsError(false);
      setMessage('');
      toast.success(`Welcome back, ${data.name}!`);
    } catch (error) {
      setIsError(true);
      const errMsg = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      setMessage(errMsg);
      setIsSuccess(false);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsSuccess(false);
    setIsError(false);
    setMessage('');
    toast.success('Logged out successfully');
  };

  const reset = () => {
    setIsError(false);
    setIsSuccess(false);
    setIsLoading(false);
    setMessage('');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isError,
        isSuccess,
        isLoading,
        message,
        register,
        login,
        logout,
        reset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
