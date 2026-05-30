import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-neutral-950">
        <div className="flex items-center gap-2 text-gray-400 dark:text-neutral-500 text-sm">
          <Loader2 size={16} className="animate-spin" />
          Cargando...
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  return children;
}
