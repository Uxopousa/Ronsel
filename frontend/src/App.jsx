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
import api from './services/api';

function DemoRedirect() {
  const { user } = useAuth();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (user) return;
    api.get('/auth/demo')
      .then(res => {
        localStorage.setItem('token', res.data.token);
        window.location.href = '/';
      })
      .catch(() => setError(true));
  }, [user]);

  if (user) return <Navigate to="/" />;
  if (error) return <Navigate to="/login" />;
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-neutral-950">
      <p className="text-gray-400 dark:text-neutral-500 text-sm">Entrando en la demo...</p>
    </div>
  );
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
