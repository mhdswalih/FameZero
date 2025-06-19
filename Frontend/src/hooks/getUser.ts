import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';

export const useAuth = () => {
  const user = useSelector((state: RootState) => state.user);
  return !!user.token;
};