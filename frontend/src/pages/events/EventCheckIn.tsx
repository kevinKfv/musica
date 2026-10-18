import React, { useState } from 'react';
import { eventsApi, Ticket } from '../../api/eventsApi';
import { useNavigate } from 'react-router-dom';
import { ScanLine, CheckCircle, XCircle } from 'lucide-react';

export const EventCheckIn = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; ticket?: Ticket } | null>(null);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const ticket = await eventsApi.checkIn(token);
      setResult({
        success: true,
        message: '¡Ticket validado con éxito!',
        ticket
      });
      setToken(''); // clear for next scan
    } catch (error: any) {
      console.error('Error checking in:', error);
      setResult({
        success: false,
        message: error.response?.data?.message || 'Error al validar ticket. QR inválido o ya usado.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <button 
          onClick={() => navigate('/events')}
          className="text-orange-400 hover:text-orange-300 mb-6 flex items-center gap-2 transition-colors"
        >
          &larr; Volver a Eventos
        </button>

        <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-orange-500/20 rounded-full">
              <ScanLine className="w-12 h-12 text-orange-400" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2">
            Módulo de Check-in
          </h2>
          <p className="text-slate-400 mb-8">
            Escanea el código QR del asistente (simulado pegando el Token).
          </p>

          <form onSubmit={handleCheckIn} className="space-y-4 mb-8">
            <input 
              type="text"
              required
              placeholder="Ingresa el QR Token (UUID)"
              className="w-full bg-slate-900 border border-slate-600 rounded-xl px-6 py-4 text-center text-lg font-mono text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <button 
              type="submit"
              disabled={loading || !token}
              className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)] disabled:opacity-50 text-lg"
            >
              {loading ? 'Validando...' : 'Validar Entrada'}
            </button>
          </form>

          {result && (
            <div className={`p-6 rounded-2xl border ${result.success ? 'bg-emerald-900/30 border-emerald-500' : 'bg-red-900/30 border-red-500'}`}>
              <div className="flex items-center justify-center gap-3 mb-2">
                {result.success ? (
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-400" />
                )}
                <h3 className={`text-2xl font-bold ${result.success ? 'text-emerald-400' : 'text-red-400'}`}>
                  {result.message}
                </h3>
              </div>
              
              {result.success && result.ticket && (
                <div className="text-slate-300 mt-4 text-sm font-mono bg-slate-900 p-4 rounded-lg">
                  <p>Estado: <span className="text-emerald-400 font-bold">{result.ticket.status}</span></p>
                  <p>ID Ticket: {result.ticket.id}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
