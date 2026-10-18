import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsApi, Event, TicketTier, Ticket } from '../../api/eventsApi';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar as CalendarIcon, MapPin, Ticket as TicketIcon } from 'lucide-react';

export const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [tiers, setTiers] = useState<TicketTier[]>([]);
  const [purchasedTicket, setPurchasedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const events = await eventsApi.getAllEvents();
      const currentEvent = events.find(e => e.id === id);
      if (currentEvent) setEvent(currentEvent);

      const eventTiers = await eventsApi.getTicketTiers(id!);
      setTiers(eventTiers);
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  const handlePurchase = async (tierId: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const buyerId = '22222222-2222-2222-2222-222222222222'; // Mock user ID
      const ticket = await eventsApi.purchaseTicket(id, tierId, buyerId);
      setPurchasedTicket(ticket);
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      alert('Error al comprar la entrada. Quizás el aforo está lleno.');
    } finally {
      setLoading(false);
    }
  };

  if (purchasedTicket) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex justify-center items-center p-8">
        <div className="bg-slate-800 border border-orange-500 rounded-3xl p-10 max-w-sm w-full text-center shadow-[0_0_40px_rgba(249,115,22,0.3)]">
          <h2 className="text-3xl font-extrabold text-orange-400 mb-2">¡Entrada Confirmada!</h2>
          <p className="text-slate-400 mb-8">Presenta este código en la puerta del evento.</p>
          
          <div className="bg-white p-4 rounded-2xl inline-block mb-8">
            <QRCodeSVG value={purchasedTicket.qrToken} size={200} />
          </div>
          
          <p className="text-sm text-slate-500 font-mono mb-6 break-all">
            Token: {purchasedTicket.qrToken}
          </p>

          <button 
            onClick={() => navigate('/events')}
            className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
          >
            Volver a Eventos
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return <div className="min-h-screen bg-slate-900 text-white flex justify-center items-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 flex justify-center items-start">
      <div className="max-w-4xl w-full">
        <button 
          onClick={() => navigate('/events')}
          className="text-orange-400 hover:text-orange-300 mb-6 flex items-center gap-2 transition-colors"
        >
          &larr; Volver a Eventos
        </button>

        <div className="bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
          <div className="h-64 bg-slate-700 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
          
          <div className="p-8">
            <h1 className="text-4xl font-extrabold mb-4">{event.title}</h1>
            
            <div className="flex flex-wrap gap-6 mb-8 text-slate-400">
              <div className="flex items-center text-lg">
                <CalendarIcon className="w-5 h-5 mr-2 text-orange-400" />
                {new Date(event.eventDate).toLocaleString()}
              </div>
              <div className="flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2 text-rose-400" />
                {event.location}
              </div>
            </div>
            
            <p className="text-lg text-slate-300 mb-10 leading-relaxed">
              {event.description}
            </p>

            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TicketIcon className="text-orange-400" /> 
              Entradas Disponibles
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tiers.map(tier => (
                <div key={tier.id} className="bg-slate-900 rounded-2xl p-6 border border-slate-700 flex justify-between items-center">
                  <div>
                    <h4 className="text-xl font-bold text-orange-300 mb-1">{tier.name}</h4>
                    <p className="text-slate-400 text-sm">
                      Quedan {tier.availableQuantity} de {tier.capacity}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-white mb-2">
                      ${tier.price} <span className="text-sm font-normal text-slate-500">{tier.currency}</span>
                    </div>
                    <button 
                      onClick={() => handlePurchase(tier.id)}
                      disabled={loading || tier.availableQuantity <= 0}
                      className="px-6 py-2 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-semibold rounded-lg transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Comprando...' : (tier.availableQuantity > 0 ? 'Comprar' : 'Agotado')}
                    </button>
                  </div>
                </div>
              ))}
              {tiers.length === 0 && (
                <div className="col-span-full text-slate-500 italic">No hay entradas configuradas para este evento.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
