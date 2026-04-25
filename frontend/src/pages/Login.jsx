import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/ui/BrandLogo';
import { LogIn } from 'lucide-react';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950 px-4">
      <div className="w-full max-w-sm animate-slide-up">
        <div className="text-center mb-8">
          <BrandLogo size={40} className="mx-auto mb-3" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">Ronsel</h1>
          <p className="text-sm text-gray-400 dark:text-neutral-500 mt-1">Inicia sesión en tu cuenta</p>
        </div>

        <div className="card p-6">
          {error && (
            <div className="mb-4 px-3 py-2 bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900 rounded-md text-xs text-red-600 dark:text-red-300">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="tu@email.com" />
            </div>
            <div>
              <label className="input-label">Contraseña</label>
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input" placeholder="••••••••" />
            </div>
            <button type="submit" className="btn-primary btn-lg w-full gap-2">
              <LogIn size={15} />Iniciar sesión
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-neutral-500 mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
