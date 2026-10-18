import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../api/apiClient';
import { useAuthStore } from '../../store/useAuthStore';

export default function RegisterPage() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore(state => state.setAuth);
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/auth/register', data);
      setAuth({ email: response.data.email }, response.data.accessToken);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar la cuenta. Es posible que el correo ya esté en uso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
      <div className="bg-neutral-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-neutral-700/50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">BandHub</h1>
          <p className="text-neutral-400 mt-2">Crea tu cuenta gratuita</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input 
                type="email" 
                {...register('email', { required: true })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input 
                type="password" 
                {...register('password', { required: true })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? 'Creando cuenta...' : <><UserPlus className="w-5 h-5"/> Registrarme</>}
          </button>
        </form>

        <p className="text-center text-neutral-400 mt-6 text-sm">
          ¿Ya tienes una cuenta? <Link to="/login" className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1">Inicia sesión <ArrowRight className="w-3 h-3"/></Link>
        </p>
      </div>
    </div>
  );
}
