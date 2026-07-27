import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/ui/BrandLogo';
import { Button } from '../components/ui/Button';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm animate-slide-up">
        <div className="text-center mb-8">
          <BrandLogo size={40} className="mx-auto mb-3" />
          <h1 className="text-xl font-semibold text-text-primary font-display">Ronsel</h1>
          <p className="text-sm text-text-tertiary mt-1">Crea tu cuenta</p>
        </div>

        <div className="card p-6">
          {error && (
            <div className="mb-4 px-3 py-2 bg-error-bg border border-error/20 rounded-md text-xs text-error-text">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Nombre</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Tu nombre" />
            </div>
            <div>
              <label className="input-label">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="tu@email.com" />
            </div>
            <div>
              <label className="input-label">Contraseña</label>
              <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input" placeholder="••••••••" />
              <p className="text-[0.625rem] text-text-tertiary mt-1">Mínimo 8 caracteres</p>
            </div>
            <Button type="submit" variant="primary" size="lg" className="w-full">
              <UserPlus size={15} />Crear cuenta
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-text-tertiary mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
