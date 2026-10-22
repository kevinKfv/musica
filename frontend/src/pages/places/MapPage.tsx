import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { placesApi, PlaceDTO } from '../../api/placesApi';
import { PlaceForm } from './PlaceForm';
import { MapPin, Info, Search, Filter, Compass, Music, Building2, Mic2, Beer, Plus, Phone, Navigation } from 'lucide-react';
import { Button } from '../../components/ui/Button';

// Fix for default Leaflet icon issue with webpack/vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const DEFAULT_PLACES: PlaceDTO[] = [
  {
    id: 'p-1',
    name: 'La Cueva Bar & Live Stage',
    description: 'Mítico bar porteño con escenario acústico, consola digital Behringer X32 y microfonía Shure SM58.',
    latitude: -34.5889,
    longitude: -58.4305,
    placeType: 'BAR',
    address: 'Av. Santa Fe 3420, Palermo, CABA',
    createdAt: new Date().toISOString(),
    createdByEmail: 'admin@bandhub.com',
  },
  {
    id: 'p-2',
    name: 'Estudio El Pie Recording',
    description: 'Estudio clase A de grabación y mastering con consola SSL 4000E, preamplificadores Neve y micrófonos Neumann U87.',
    latitude: -34.5715,
    longitude: -58.4623,
    placeType: 'RECORDING_STUDIO',
    address: 'Villa Urquiza, CABA',
    createdAt: new Date().toISOString(),
    createdByEmail: 'admin@bandhub.com',
  },
  {
    id: 'p-3',
    name: 'Salas La Bohemia',
    description: '4 salas de ensayo totalmente acustizadas con Marshall JCM900, Ampeg SVT-CL y batería Pearl Export con platillos Sabian.',
    latitude: -34.6037,
    longitude: -58.4116,
    placeType: 'REHEARSAL_ROOM',
    address: 'Av. Corrientes 3800, Almagro, CABA',
    createdAt: new Date().toISOString(),
    createdByEmail: 'admin@bandhub.com',
  },
  {
    id: 'p-4',
    name: 'Teatro Vorterix Live',
    description: 'Auditorio para recitales con capacidad para 1500 personas, sistema Line Array D&B y pantalla LED 4K.',
    latitude: -34.5772,
    longitude: -58.4455,
    placeType: 'VENUE',
    address: 'Federico Lacroze 3455, Colegiales, CABA',
    createdAt: new Date().toISOString(),
    createdByEmail: 'admin@bandhub.com',
  },
  {
    id: 'p-5',
    name: 'Estudios Panda',
    description: 'Estudio histórico del rock nacional donde grabaron Charly García, Soda Stereo y Los Redondos. Microfonía valvular vintage.',
    latitude: -34.6305,
    longitude: -58.4820,
    placeType: 'RECORDING_STUDIO',
    address: 'Segurola 1400, Floresta, CABA',
    createdAt: new Date().toISOString(),
    createdByEmail: 'admin@bandhub.com',
  },
  {
    id: 'p-6',
    name: 'Niceto Club',
    description: 'Espacio de referencia para bandas independientes y festivales emergentes con excelente acústica y camarines equipados.',
    latitude: -34.5861,
    longitude: -58.4389,
    placeType: 'VENUE',
    address: 'Niceto Vega 5510, Palermo Soho, CABA',
    createdAt: new Date().toISOString(),
    createdByEmail: 'admin@bandhub.com',
  },
];

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  ALL: { label: 'Todos', color: '#a5b4fc', bg: 'rgba(99, 102, 241, 0.15)', icon: Compass },
  REHEARSAL_ROOM: { label: 'Salas de Ensayo', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', icon: Music },
  RECORDING_STUDIO: { label: 'Estudios', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.15)', icon: Mic2 },
  BAR: { label: 'Bares en Vivo', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: Beer },
  VENUE: { label: 'Teatros & Auditorios', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)', icon: Building2 },
};

const AddMarkerToClick = ({ onMapClick }: { onMapClick: (latlng: L.LatLng) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

// Component to programmatically fly to a selected place
const MapFlyTo = ({ target }: { target: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo(target, 15, { duration: 1.2 });
    }
  }, [target, map]);
  return null;
};

export const MapPage: React.FC = () => {
  const [places, setPlaces] = useState<PlaceDTO[]>(DEFAULT_PLACES);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);
  const [newPlaceLocation, setNewPlaceLocation] = useState<L.LatLng | null>(null);
  const [showMobileList, setShowMobileList] = useState(false);

  const fetchPlaces = async () => {
    try {
      const data = await placesApi.getAllPlaces();
      if (data && data.length > 0) {
        // Merge API places with default rich seed places ensuring no duplicates by name
        const names = new Set(data.map(p => p.name.toLowerCase()));
        const uniqueDefaults = DEFAULT_PLACES.filter(dp => !names.has(dp.name.toLowerCase()));
        setPlaces([...data, ...uniqueDefaults]);
      } else {
        setPlaces(DEFAULT_PLACES);
      }
    } catch {
      setPlaces(DEFAULT_PLACES);
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

  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      const matchesCategory = selectedCategory === 'ALL' || p.placeType === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.address && p.address.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [places, selectedCategory, searchQuery]);

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {/* Top Header & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--bh-primary, #6366f1)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MapPin size={18} />
            </span>
            <h1
              style={{
                fontFamily: 'var(--bh-font-display, "Syne", sans-serif)',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#ffffff',
                margin: 0,
              }}
            >
              Directorio & Mapa de Salas
            </h1>
          </div>
          <p style={{ margin: 0, color: 'var(--bh-text-secondary, #a1a1aa)', fontSize: '0.875rem' }}>
            Explorá salas de ensayo, estudios de grabación, bares con escenario y auditorios musicales.
          </p>
        </div>

        {/* Search input & Add place button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#71717a',
              }}
            />
            <input
              type="text"
              placeholder="Buscar sala, estudio o barrio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.1))',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          <Button
            variant="primary"
            onClick={() => setNewPlaceLocation(new L.LatLng(-34.595, -58.42))}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', padding: '8px 14px' }}
          >
            <Plus size={16} />
            <span>Agregar Lugar</span>
          </Button>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
          const isSelected = selectedCategory === key;
          const Icon = config.icon;
          const count = key === 'ALL' ? places.length : places.filter(p => p.placeType === key).length;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: isSelected ? config.bg : 'rgba(255, 255, 255, 0.03)',
                border: isSelected ? `1px solid ${config.color}` : '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.06))',
                color: isSelected ? '#fff' : 'var(--bh-text-secondary, #a1a1aa)',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={14} style={{ color: config.color }} />
              <span>{config.label}</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.6, marginLeft: '2px' }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Main Container: Sidebar Directory + Leaflet Map */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '360px 1fr',
          height: 'calc(100vh - 230px)',
          minHeight: '520px',
          borderRadius: '1.25rem',
          overflow: 'hidden',
          border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.08))',
          background: 'var(--bh-bg-surface, #12121a)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Left Directory Sidebar */}
        <div
          style={{
            borderRight: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.08))',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(10, 10, 15, 0.6)',
            overflowY: 'auto',
          }}
        >
          <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.06))', fontSize: '0.8rem', color: '#71717a', fontWeight: 600 }}>
            {filteredPlaces.length} {filteredPlaces.length === 1 ? 'LUGAR ENCONTRADO' : 'LUGARES ENCONTRADOS'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0.75rem' }}>
            {filteredPlaces.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#71717a' }}>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>No se encontraron lugares en esta categoría.</p>
              </div>
            ) : (
              filteredPlaces.map((place) => {
                const config = CATEGORY_CONFIG[place.placeType] || CATEGORY_CONFIG.VENUE;
                const Icon = config.icon;
                return (
                  <div
                    key={place.id}
                    onClick={() => setFlyTarget([place.latitude, place.longitude])}
                    style={{
                      padding: '1rem',
                      borderRadius: '0.875rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.06))',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                      e.currentTarget.style.borderColor = 'var(--bh-border-subtle, rgba(255, 255, 255, 0.06))';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <h4
                        style={{
                          margin: 0,
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: '#fff',
                          fontFamily: 'var(--bh-font-display, "Syne", sans-serif)',
                        }}
                      >
                        {place.name}
                      </h4>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          background: config.bg,
                          color: config.color,
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                        }}
                      >
                        {config.label}
                      </span>
                    </div>

                    {place.description && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.8rem',
                          color: '#a1a1aa',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {place.description}
                      </p>
                    )}

                    {place.address && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#71717a', marginTop: '2px' }}>
                        <MapPin size={13} style={{ color: config.color, flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{place.address}</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--bh-primary, #6366f1)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Navigation size={12} /> Ver en mapa
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Map Canvas */}
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <MapContainer
            center={[-34.595, -58.43]} // Centered in Buenos Aires musical hub
            zoom={13}
            style={{ height: '100%', width: '100%', zIndex: 10 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapFlyTo target={flyTarget} />

            {filteredPlaces.map((place) => {
              const config = CATEGORY_CONFIG[place.placeType] || CATEGORY_CONFIG.VENUE;
              return (
                <Marker key={place.id} position={[place.latitude, place.longitude]}>
                  <Popup>
                    <div style={{ padding: '6px', minWidth: '180px', fontFamily: 'sans-serif', color: '#18181b' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', marginBottom: '2px' }}>
                        {config.label}
                      </div>
                      <h3 style={{ margin: '0 0 4px', fontWeight: 800, fontSize: '1rem', color: '#09090b' }}>{place.name}</h3>
                      {place.description && (
                        <p style={{ margin: '0 0 6px', fontSize: '0.8rem', color: '#52525b', lineHeight: 1.4 }}>{place.description}</p>
                      )}
                      {place.address && (
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#71717a', fontWeight: 500 }}>
                          📍 {place.address}
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            <AddMarkerToClick onMapClick={handleMapClick} />

            {newPlaceLocation && (
              <Marker position={newPlaceLocation}>
                <Popup closeButton={false}>
                  <div style={{ textAlign: 'center', fontWeight: 600, color: '#18181b', fontSize: '0.85rem' }}>
                    📍 Nueva ubicación seleccionada
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>

          {/* New Place Form Floating Drawer */}
          {newPlaceLocation && (
            <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 1000, maxWidth: '380px', width: '100%' }}>
              <PlaceForm
                initialLat={newPlaceLocation.lat}
                initialLng={newPlaceLocation.lng}
                onSuccess={handlePlaceAdded}
                onCancel={() => setNewPlaceLocation(null)}
              />
            </div>
          )}

          {/* Floating Instructions Banner */}
          {!newPlaceLocation && (
            <div
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 1000,
                background: 'rgba(18, 18, 26, 0.9)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.1))',
                borderRadius: '10px',
                padding: '8px 14px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#f4f4f5',
                fontSize: '0.8125rem',
                fontWeight: 500,
                pointerEvents: 'none',
              }}
            >
              <Info size={16} color="var(--bh-primary, #6366f1)" />
              <span>Hacé clic en el mapa para marcar una nueva sala o estudio</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
