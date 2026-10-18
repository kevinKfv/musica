import React, { useState } from 'react';
import { marketplaceApi } from '../../api/marketplaceApi';
import { useNavigate } from 'react-router-dom';

export const PublishService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Music Production',
    price: 0,
    currency: 'USD'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const providerId = '11111111-1111-1111-1111-111111111111'; // Mock user ID for now
      await marketplaceApi.publishService({
        ...formData,
        providerId
      });
      navigate('/marketplace');
    } catch (error) {
      console.error('Error publishing service:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 flex justify-center items-start">
      <div className="max-w-2xl w-full bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl mt-10">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6">
          Publicar Nuevo Servicio
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-300 mb-2 font-medium">Título del Servicio</label>
            <input 
              type="text"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Ej. Mezcla y Masterización Profesional"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 font-medium">Descripción</label>
            <textarea 
              required
              rows={4}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe lo que ofreces en detalle..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-300 mb-2 font-medium">Categoría</label>
              <select 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Music Production">Producción Musical</option>
                <option value="Mixing & Mastering">Mezcla & Masterización</option>
                <option value="Session Musician">Músico de Sesión</option>
                <option value="Vocals">Voces / Coros</option>
              </select>
            </div>
            
            <div>
              <label className="block text-slate-300 mb-2 font-medium">Precio (USD)</label>
              <input 
                type="number"
                required
                min="1"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <button 
              type="button"
              onClick={() => navigate('/marketplace')}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all shadow-[0_0_15px_rgba(139,92,246,0.5)] disabled:opacity-50"
            >
              {loading ? 'Publicando...' : 'Publicar Servicio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
