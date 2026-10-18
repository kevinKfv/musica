import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { placesApi, PlaceDTO } from '../../api/placesApi';
import { PlaceForm } from './PlaceForm';

// Fix for default Leaflet icon issue with webpack/vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const AddMarkerToClick = ({ onMapClick }: { onMapClick: (latlng: L.LatLng) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

export const MapPage: React.FC = () => {
  const [places, setPlaces] = useState<PlaceDTO[]>([]);
  const [newPlaceLocation, setNewPlaceLocation] = useState<L.LatLng | null>(null);

  const fetchPlaces = async () => {
    try {
      const data = await placesApi.getAllPlaces();
      setPlaces(data);
    } catch (error) {
      console.error("Failed to fetch places", error);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleMapClick = (latlng: L.LatLng) => {
    setNewPlaceLocation(latlng);
  };

  const handlePlaceAdded = () => {
    setNewPlaceLocation(null);
    fetchPlaces();
  };

  return (
    <div className="h-full w-full relative" style={{ height: 'calc(100vh - 64px)' }}>
      <MapContainer 
        center={[-34.6037, -58.3816]} // Default to Buenos Aires, or adjust as needed
        zoom={13} 
        style={{ height: '100%', width: '100%', zIndex: 10 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {places.map((place) => (
          <Marker key={place.id} position={[place.latitude, place.longitude]}>
            <Popup>
              <div className="font-sans">
                <h3 className="font-bold text-lg">{place.name}</h3>
                <p className="text-sm text-gray-500 italic">{place.placeType}</p>
                {place.description && <p className="mt-1">{place.description}</p>}
                {place.address && <p className="mt-1 text-sm">{place.address}</p>}
              </div>
            </Popup>
          </Marker>
        ))}

        <AddMarkerToClick onMapClick={handleMapClick} />
        
        {newPlaceLocation && (
          <Marker position={newPlaceLocation}>
            <Popup closeButton={false}>
              <div className="text-center font-bold">Nueva ubicación seleccionada</div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {newPlaceLocation && (
        <div className="absolute top-4 right-4 z-[1000] w-80">
          <PlaceForm 
            initialLat={newPlaceLocation.lat} 
            initialLng={newPlaceLocation.lng} 
            onSuccess={handlePlaceAdded}
            onCancel={() => setNewPlaceLocation(null)}
          />
        </div>
      )}
      
      {!newPlaceLocation && (
        <div className="absolute top-4 right-4 z-[1000] bg-white p-3 rounded shadow pointer-events-none">
          <p className="text-sm font-semibold">Haz clic en el mapa para agregar un lugar</p>
        </div>
      )}
    </div>
  );
};
