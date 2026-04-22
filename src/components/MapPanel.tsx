import { useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';

export type MapPoint = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  kind: string;
  summary: string;
  color: string;
};

function createMarkerIcon(color: string) {
  return L.divIcon({
    className: 'map-pin',
    html: `<span style="background:${color}"></span>`,
    iconSize: [18, 18]
  });
}

export default function MapPanel({
  points,
  onSelect
}: {
  points: MapPoint[];
  onSelect?: (id: string) => void;
}) {
  const [selectedId, setSelectedId] = useState(points[0]?.id ?? '');
  const center = useMemo(
    () => ({
      lat: points[0]?.lat ?? 14.5995,
      lng: points[0]?.lng ?? 120.9842
    }),
    [points]
  );

  if (points.length === 0) {
    return <div className="map-empty">No nearby results match your filters yet.</div>;
  }

  return (
    <div className="map-panel">
      <MapContainer center={[center.lat, center.lng]} zoom={11} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((point) => (
          <Marker
            eventHandlers={{
              click: () => {
                setSelectedId(point.id);
                onSelect?.(point.id);
              }
            }}
            icon={createMarkerIcon(point.color)}
            key={point.id}
            position={[point.lat, point.lng]}
          >
            <Popup>
              <strong>{point.label}</strong>
              <p>{point.summary}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="map-preview-strip">
        {points.map((point) => (
          <button
            className={`map-preview-card ${point.id === selectedId ? 'active' : ''}`}
            key={point.id}
            onClick={() => {
              setSelectedId(point.id);
              onSelect?.(point.id);
            }}
            type="button"
          >
            <span className="card-label" style={{ color: point.color }}>
              {point.kind}
            </span>
            <strong>{point.label}</strong>
            <p>{point.summary}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
