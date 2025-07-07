import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout as logoutApi } from '../../services/apiAuth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isPending, mutate: logout } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.removeQueries();
      navigate('/login', { replace: true });
      toast.success('You have successfully logged out');
    },
    onError: () => toast.error('Error while logging out'),
  });

  return { isPending, logout };
}

export default useLogout;
