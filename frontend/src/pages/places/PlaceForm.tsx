import React, { useState } from 'react';
import { useForm } from 'react-form-hook'; // Or whatever they use, wait they use react-hook-form
import { useForm as useHookForm } from 'react-hook-form';
import { placesApi, CreatePlaceRequest } from '../../api/placesApi';

interface PlaceFormProps {
  initialLat: number;
  initialLng: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PlaceForm: React.FC<PlaceFormProps> = ({ initialLat, initialLng, onSuccess, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useHookForm<CreatePlaceRequest>({
    defaultValues: {
      latitude: initialLat,
      longitude: initialLng,
      placeType: 'BAR'
    }
  });
  
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: CreatePlaceRequest) => {
    setLoading(true);
    try {
      await placesApi.createPlace(data);
      onSuccess();
    } catch (error) {
      console.error("Failed to create place", error);
      alert("Error al crear el lugar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Agregar Nuevo Lugar</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input 
            {...register("name", { required: true })} 
            className="w-full border p-2 rounded" 
            placeholder="Ej. El Templo del Rock"
          />
          {errors.name && <span className="text-red-500 text-sm">Este campo es requerido</span>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tipo de Lugar</label>
          <select {...register("placeType")} className="w-full border p-2 rounded">
            <option value="BAR">Bar / Pub</option>
            <option value="RECORDING_STUDIO">Estudio de Grabación</option>
            <option value="REHEARSAL_ROOM">Sala de Ensayo</option>
            <option value="VENUE">Venue / Teatro</option>
            <option value="OTHER">Otro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea 
            {...register("description")} 
            className="w-full border p-2 rounded" 
            placeholder="Detalles sobre el equipo, aforo, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Dirección</label>
          <input 
            {...register("address")} 
            className="w-full border p-2 rounded" 
            placeholder="Calle Falsa 123"
          />
        </div>

        <div className="flex gap-2 justify-end mt-4">
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancelar</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar Lugar'}
          </button>
        </div>
      </form>
    </div>
  );
};
