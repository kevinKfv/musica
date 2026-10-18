import React, { useState, useEffect } from 'react';
import { eventsApi, Event } from '../../api/eventsApi';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';

export const EventsHome = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventsApi.getAllEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-600 mb-2">
              Eventos & Entradas
            </h1>
            <p className="text-slate-400 text-lg">Descubre conciertos y adquiere tus tickets con código QR.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/events/checkin')}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-full transition-colors border border-slate-700"
            >
              Check-in (Staff)
            </button>
            <button 
              onClick={() => navigate('/events/create')}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-semibold rounded-full transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)]"
            >
              Organizar Evento
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.length === 0 ? (
            <div className="col-span-full text-center text-slate-500 py-12">
              No hay eventos publicados por el momento.
            </div>
          ) : (
            events.map(event => (
              <div 
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                className="group bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-orange-500 transition-all cursor-pointer hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(249,115,22,0.2)] flex flex-col"
              >
                <div className="h-48 bg-slate-700 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-400 transition-colors">
                    {event.title}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-slate-400 text-sm">
                      <CalendarIcon className="w-4 h-4 mr-2 text-rose-400" />
                      {new Date(event.eventDate).toLocaleString()}
                    </div>
                    <div className="flex items-center text-slate-400 text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-rose-400" />
                      {event.location}
                    </div>
                  </div>
                  <p className="text-slate-400 line-clamp-2 mt-auto">
                    {event.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
