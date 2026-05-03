import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const init = useAuthStore((state) => state.init);

  useEffect(() => {
    init();
  }, []);

  // Show loading state while initializing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-main">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 bg-gradient-accent rounded-full blur-md opacity-20"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-primary-500 border-r-primary-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
