/**
 * Geocode an address string to coordinates.
 * Uses Google Geocoder when Maps script is loaded, else Geocoding API fetch.
 */
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY as string | undefined;

export interface GeocodeResult {
  lat: number;
  lng: number;
}

export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  const trimmed = address.trim();
  if (!trimmed) throw new Error('Address is required');

  if (typeof window !== 'undefined' && window.google?.maps?.Geocoder) {
    return new Promise((resolve, reject) => {
      const geocoder = new window.google!.maps.Geocoder();
      geocoder.geocode({ address: trimmed }, (results, status) => {
        if (status === 'OK' && results?.[0]?.geometry?.location) {
          resolve({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          });
        } else {
          reject(new Error('Could not find coordinates for this location'));
        }
      });
    });
  }

  if (!GOOGLE_API_KEY) throw new Error('Geocoding requires API key. Use location from dropdown or Current Location.');
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(trimmed)}&key=${GOOGLE_API_KEY}`;
  const res = await fetch(url);
  const data = (await res.json()) as { results?: Array<{ geometry?: { location?: { lat: number; lng: number } } }> };
  const loc = data.results?.[0]?.geometry?.location;
  if (!loc) throw new Error('Could not find coordinates for this location');
  return { lat: loc.lat, lng: loc.lng };
}
