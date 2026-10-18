import React, { useState, useEffect } from 'react';
import { marketplaceApi, ServiceOffering } from '../../api/marketplaceApi';
import { useNavigate } from 'react-router-dom';

export const MarketplaceHome = () => {
  const [services, setServices] = useState<ServiceOffering[]>([]);
  const [category, setCategory] = useState<string>('Music Production');
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, [category]);

  const fetchServices = async () => {
    try {
      const data = await marketplaceApi.getServicesByCategory(category);
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
              Marketplace
            </h1>
            <p className="text-slate-400 text-lg">Encuentra a los mejores profesionales para tu música</p>
          </div>
          <button 
            onClick={() => navigate('/marketplace/publish')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold rounded-full transition-all shadow-[0_0_15px_rgba(139,92,246,0.5)]"
          >
            Publicar Servicio
          </button>
        </header>

        <div className="flex gap-4 mb-8">
          {['Music Production', 'Mixing & Mastering', 'Session Musician', 'Vocals'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                category === cat 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.length === 0 ? (
            <div className="col-span-full text-center text-slate-500 py-12">
              No hay servicios disponibles en esta categoría.
            </div>
          ) : (
            services.map(service => (
              <div 
                key={service.id}
                onClick={() => navigate(`/marketplace/service/${service.id}`)}
                className="group bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-purple-500 transition-all cursor-pointer hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(139,92,246,0.2)]"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-slate-900 text-purple-400 text-xs font-semibold rounded-full uppercase tracking-wider">
                    {service.category}
                  </span>
                  <span className="text-xl font-bold text-emerald-400">
                    ${service.price} {service.currency}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-300 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-400 line-clamp-3">
                  {service.description}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
