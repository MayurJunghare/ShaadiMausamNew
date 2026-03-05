ShaadiMausam

## Location search (Google Places)

For the location autocomplete dropdown to work, enable these in [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Enable APIs:

1. **Maps JavaScript API**
2. **Places API**

Then set `VITE_GOOGLE_PLACES_API_KEY` in `.env`. Restrict the key to **Websites** and add your referrers (e.g. `http://localhost:*`).

For “Use Current Location” to show a place name instead of coordinates, enable **Geocoding API** as well.

## Weather & AI (Analyze feature)

Add to `.env`:

- `VITE_BACKEND_API_URL` – Earth2 API base (default: `https://shaadimausam.in/api`)
- `VITE_ANTHROPIC_API_KEY` – Claude API key for AI recommendations (optional; uses defaults if missing)
