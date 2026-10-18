import React, { useState } from 'react';
import { useAgendaStore } from '../../../store/agendaStore';
import { CreateEventRequest } from '../../../api/agendaApi';

interface EventModalProps {
  onClose: () => void;
  userId: string;
}

const EventModal: React.FC<EventModalProps> = ({ onClose, userId }) => {
  const { addEvent } = useAgendaStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    eventType: 'REHEARSAL'
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      // Basic validation
      if (!formData.title || !formData.start || !formData.end) {
        throw new Error("Por favor completa los campos obligatorios.");
      }

      const request: CreateEventRequest = {
        userId,
        title: formData.title,
        description: formData.description,
        start: new Date(formData.start).toISOString(),
        end: new Date(formData.end).toISOString(),
        eventType: formData.eventType
      };

      await addEvent(request);
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al crear el evento");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4">Crear Evento</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título *</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Inicio *</label>
              <input 
                type="datetime-local" 
                name="start" 
                value={formData.start} 
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Fin *</label>
              <input 
                type="datetime-local" 
                name="end" 
                value={formData.end} 
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Evento</label>
            <select 
              name="eventType" 
              value={formData.eventType} 
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white"
            >
              <option value="REHEARSAL">Ensayo</option>
              <option value="GIG">Presentación / Concierto</option>
              <option value="CLASS">Clase</option>
              <option value="MEETING">Reunión</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
