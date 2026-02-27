import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useAuthUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const res = await axios.get('https://ecosimple-t402.onrender.com/api/profile', {
  headers: { Authorization: `Bearer ${token}` },
});
      return res.data;
    },
    retry: false,
  });

  const logout = () => {
    localStorage.removeItem('token');
    queryClient.clear();
    navigate('/login');
  };

  return { authUser, isLoading, logout };
};

export default useAuthUser;