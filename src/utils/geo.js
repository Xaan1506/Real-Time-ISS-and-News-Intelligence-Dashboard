export function toRadians(value) {
  return (value * Math.PI) / 180;
}

export function haversineDistance(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

export function calculateSpeedKmH(previous, current) {
  if (!previous || !current) return 0;
  const distanceKm = haversineDistance(previous.latitude, previous.longitude, current.latitude, current.longitude);
  const diffHours = (current.timestamp - previous.timestamp) / 3600;
  if (diffHours <= 0) return 0;
  return Number((distanceKm / diffHours).toFixed(2));
}
