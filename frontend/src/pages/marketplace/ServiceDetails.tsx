import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { marketplaceApi } from '../../api/marketplaceApi';

export const ServiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bookingDate, setBookingDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    try {
      const clientId = '22222222-2222-2222-2222-222222222222'; // Mock client ID
      const dateIso = new Date(bookingDate).toISOString();
      await marketplaceApi.requestBooking(id, {
        clientId,
        bookingDate: dateIso,
        notes
      });
      setSuccess(true);
      setTimeout(() => navigate('/marketplace'), 3000);
    } catch (error) {
      console.error('Error requesting booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex justify-center items-center p-8">
        <div className="bg-emerald-900/30 border border-emerald-500 rounded-2xl p-8 max-w-md text-center">
          <h2 className="text-3xl font-bold text-emerald-400 mb-4">¡Solicitud Enviada!</h2>
          <p className="text-slate-300">El profesional revisará tu solicitud de reserva pronto. Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 flex justify-center items-start">
      <div className="max-w-xl w-full bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl mt-10">
        <button 
          onClick={() => navigate('/marketplace')}
          className="text-purple-400 hover:text-purple-300 mb-6 flex items-center gap-2 transition-colors"
        >
          &larr; Volver al Marketplace
        </button>

        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
          Solicitar Reserva
        </h2>
        <p className="text-slate-400 mb-8">Estás a punto de solicitar un servicio. Por favor indica la fecha y los detalles.</p>
        
        <form onSubmit={handleBooking} className="space-y-6">
          <div>
            <label className="block text-slate-300 mb-2 font-medium">Fecha y Hora Propuesta</label>
            <input 
              type="datetime-local"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 font-medium">Notas / Requisitos (Opcional)</label>
            <textarea 
              rows={4}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe qué necesitas específicamente para este servicio..."
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(139,92,246,0.5)] disabled:opacity-50 text-lg"
            >
              {loading ? 'Enviando solicitud...' : 'Confirmar Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
