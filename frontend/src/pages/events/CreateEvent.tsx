import React, { useState } from 'react';
import { eventsApi } from '../../api/eventsApi';
import { useNavigate } from 'react-router-dom';

export const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    eventDate: ''
  });
  const [tierData, setTierData] = useState({
    name: 'General',
    price: 0,
    currency: 'USD',
    capacity: 100
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const organizerId = '11111111-1111-1111-1111-111111111111'; // Mock user ID
      const dateIso = new Date(formData.eventDate).toISOString();
      
      const event = await eventsApi.createEvent({
        organizerId,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        eventDate: dateIso
      });

      await eventsApi.addTicketTier(event.id, tierData);

      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 flex justify-center items-start">
      <div className="max-w-3xl w-full bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl mt-10">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-600 mb-6">
          Organizar Nuevo Evento
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <section>
            <h3 className="text-xl font-bold border-b border-slate-700 pb-2 mb-4 text-orange-300">Datos del Evento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-slate-300 mb-2 font-medium">Título del Concierto/Festival</label>
                <input 
                  type="text" required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-slate-300 mb-2 font-medium">Descripción</label>
                <textarea 
                  required rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2 font-medium">Ubicación</label>
                <input 
                  type="text" required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                  value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2 font-medium">Fecha y Hora</label>
                <input 
                  type="datetime-local" required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                  value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})}
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold border-b border-slate-700 pb-2 mb-4 text-orange-300">Entradas (Aforo)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-slate-300 mb-2 font-medium">Tipo</label>
                <input 
                  type="text" required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                  value={tierData.name} onChange={e => setTierData({...tierData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2 font-medium">Precio (USD)</label>
                <input 
                  type="number" required min="0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                  value={tierData.price} onChange={e => setTierData({...tierData, price: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2 font-medium">Capacidad Máx.</label>
                <input 
                  type="number" required min="1"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
                  value={tierData.capacity} onChange={e => setTierData({...tierData, capacity: Number(e.target.value)})}
                />
              </div>
            </div>
          </section>

          <div className="pt-4 flex justify-end gap-4">
            <button 
              type="button" onClick={() => navigate('/events')}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-semibold rounded-lg transition-all shadow-[0_0_15px_rgba(249,115,22,0.5)] disabled:opacity-50"
            >
              {loading ? 'Publicando...' : 'Crear Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
