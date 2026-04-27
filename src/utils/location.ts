import { GeoPoint } from '@/types/models';

const knownLocations: GeoPoint[] = [
  { barangay: 'Poblacion', city: 'Makati', lat: 14.5656, lng: 121.0292 },
  { barangay: 'Teachers Village', city: 'Quezon City', lat: 14.6476, lng: 121.0619 },
  { barangay: 'Kapitolyo', city: 'Pasig', lat: 14.5716, lng: 121.0632 },
  { barangay: 'Malate', city: 'Manila', lat: 14.5692, lng: 120.9912 },
  { barangay: 'Bonifacio Global City', city: 'Taguig', lat: 14.5508, lng: 121.0509 },
  { barangay: 'Highway Hills', city: 'Mandaluyong', lat: 14.5794, lng: 121.0359 }
];

function distanceScore(aLat: number, aLng: number, bLat: number, bLng: number) {
  return Math.abs(aLat - bLat) + Math.abs(aLng - bLng);
}

export async function detectNearestGeoPoint() {
  const fallback = knownLocations[0];

  if (!('geolocation' in navigator)) {
    return fallback;
  }

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000
    });
  });

  const nearest =
    knownLocations.reduce((closest, candidate) =>
      distanceScore(position.coords.latitude, position.coords.longitude, candidate.lat, candidate.lng) <
      distanceScore(position.coords.latitude, position.coords.longitude, closest.lat, closest.lng)
        ? candidate
        : closest
    , fallback);

  return {
    ...nearest,
    lat: position.coords.latitude,
    lng: position.coords.longitude
  } satisfies GeoPoint;
}
