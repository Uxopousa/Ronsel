import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SkeletonFullPage } from '../ui/Skeleton';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <SkeletonFullPage />;
  }

  if (!user) return <Navigate to="/login" />;
  return children;
}
