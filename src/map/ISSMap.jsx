import { MapContainer, Marker, Polyline, TileLayer, Tooltip, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

const issIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3212/3212608.png',
  iconSize: [36, 36],
});

function FollowISS({ position }) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;
    map.flyTo([position.latitude, position.longitude], map.getZoom(), { duration: 1.2 });
  }, [map, position]);

  return null;
}

export function ISSMap({ positions, nearestPlace }) {
  const current = positions.at(-1);

  return (
    <div className="glass h-[360px] overflow-hidden p-2 sm:h-[430px]">
      <MapContainer
        center={current ? [current.latitude, current.longitude] : [0, 0]}
        zoom={2}
        minZoom={2}
        zoomControl={false}
        className="h-full w-full rounded-xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FollowISS position={current} />
        <ZoomControl position="topright" />
        {current ? (
          <Marker position={[current.latitude, current.longitude]} icon={issIcon}>
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              ISS: {current.latitude.toFixed(2)}, {current.longitude.toFixed(2)} - {nearestPlace}
            </Tooltip>
          </Marker>
        ) : null}
        {positions.length > 1 ? (
          <Polyline
            positions={positions.map((p) => [p.latitude, p.longitude])}
            pathOptions={{ color: '#38bdf8', weight: 3 }}
          />
        ) : null}
      </MapContainer>
    </div>
  );
}
