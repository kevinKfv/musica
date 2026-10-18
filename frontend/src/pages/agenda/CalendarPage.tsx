import React, { useEffect, useState } from 'react';
import { useAgendaStore } from '../../store/agendaStore';
import { useAuthStore } from '../../store/useAuthStore';
import EventModal from './components/EventModal';

const CalendarPage: React.FC = () => {
  const { events, fetchEvents, isLoading } = useAgendaStore();
  // Using email as a placeholder for userId until proper user profile mapping is done
  const userEmail = useAuthStore(state => state.user?.email); 
  // We need an actual UUID here, mock it for now if null. In real app, auth gives profile id.
  const userId = "00000000-0000-0000-0000-000000000001"; 

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchEvents(userId);
    }
  }, [fetchEvents, userId]);

  return (
    <div className="p-6 max-w-7xl mx-auto h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Mi Agenda</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
        >
          + Nuevo Evento
        </button>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow p-4 overflow-auto">
        {isLoading ? (
          <p className="text-gray-500">Cargando eventos...</p>
        ) : events.length === 0 ? (
          <p className="text-gray-500">No hay eventos programados.</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded shadow-sm">
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
                </p>
                <p className="mt-2 text-gray-700">{event.description}</p>
                <span className="inline-block mt-2 text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {event.eventType}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <EventModal 
          onClose={() => setIsModalOpen(false)} 
          userId={userId} 
        />
      )}
    </div>
  );
};

export default CalendarPage;
