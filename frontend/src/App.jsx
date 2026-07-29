import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Habits from './pages/Habits';
import Goals from './pages/Goals';
import { SkeletonDemoRedirect } from './components/ui/Skeleton';
import api from './services/api';

function DemoRedirect() {
  const { user, loading } = useAuth();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (user) return;
    localStorage.removeItem('token');
    api.get('/health', { timeout: 45000 }).catch(() => {});
    api.get('/auth/demo', { timeout: 45000 })
      .then(res => {
        localStorage.setItem('token', res.data.token);
        window.location.href = '/';
      })
      .catch(() => setError(true));
  }, [user, loading]);

  if (loading) return <SkeletonDemoRedirect />;
  if (user) return <Navigate to="/" />;
  if (error) return <Navigate to="/login" />;
  return <SkeletonDemoRedirect />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/demo" element={<DemoRedirect />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="habits" element={<Habits />} />
              <Route path="goals" element={<Goals />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
