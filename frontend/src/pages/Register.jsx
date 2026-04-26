import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/ui/BrandLogo';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm animate-slide-up">
        <div className="text-center mb-8">
          <BrandLogo size={40} className="mx-auto mb-3" />
          <h1 className="text-xl font-semibold text-gray-900">Ronsel</h1>
          <p className="text-sm text-gray-400 mt-1">Crea tu cuenta</p>
        </div>

        <div className="card p-6">
          {error && (
            <div className="mb-4 px-3 py-2 bg-red-50 border border-red-100 rounded-md text-xs text-red-600">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Nombre</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="input-label">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="input-label">Contraseña</label>
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input"
                placeholder="••••••••"
              />
              <p className="text-[0.625rem] text-gray-400 mt-1">Mínimo 8 caracteres</p>
            </div>
            <button type="submit" className="btn-primary btn-lg w-full gap-2">
              <UserPlus size={15} />
              Crear cuenta
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
