/* Minimal types for Google Maps Places Autocomplete (script loaded at runtime) */
interface AutocompletePrediction {
  description: string;
  place_id: string;
}

interface PlaceResultGeometry {
  location: { lat: () => number; lng: () => number };
}

interface PlaceResult {
  formatted_address?: string;
  name?: string;
  geometry?: PlaceResultGeometry;
}

interface AutocompleteInstance {
  addListener(event: 'place_changed', callback: () => void): void;
  getPlace(): PlaceResult;
}

interface PlacesService {
  Autocomplete: new (input: HTMLInputElement, opts?: { componentRestrictions?: { country: string | string[] } }) => AutocompleteInstance;
}

interface GeocoderResult {
  formatted_address?: string;
  address_components?: unknown[];
}
interface GeocoderResultGeometry {
  location: { lat: () => number; lng: () => number };
}
interface GeocoderResultFull {
  formatted_address?: string;
  geometry?: GeocoderResultGeometry;
}
interface Geocoder {
  geocode(
    request: { location?: { lat: number; lng: number }; address?: string },
    callback: (results: GeocoderResultFull[] | null, status: string) => void
  ): void;
}

interface GoogleMapsWindow {
  maps: {
    places: PlacesService;
    Geocoder: new () => Geocoder;
  };
}

declare global {
  interface Window {
    google?: GoogleMapsWindow;
    initGooglePlaces?: () => void;
  }
}

export {};
