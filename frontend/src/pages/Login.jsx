import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/ui/BrandLogo';
import { Button } from '../components/ui/Button';
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
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm animate-slide-up">
        <div className="text-center mb-8">
          <BrandLogo size={40} className="mx-auto mb-3" />
          <h1 className="text-xl font-semibold text-text-primary font-display">Ronsel</h1>
          <p className="text-sm text-text-tertiary mt-1">Inicia sesión en tu cuenta</p>
        </div>

        <div className="card p-6">
          {error && (
            <div className="mb-4 px-3 py-2 bg-error-bg border border-error/20 rounded-md text-xs text-error-text">
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
            <Button type="submit" variant="primary" size="lg" className="w-full">
              <LogIn size={15} />Iniciar sesión
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-text-tertiary mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
