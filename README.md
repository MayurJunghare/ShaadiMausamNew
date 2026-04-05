ShaadiMausam

## Location search (Google Places)

For the location autocomplete dropdown to work, enable these in [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Enable APIs:

1. **Maps JavaScript API**
2. **Places API**

Then set `VITE_GOOGLE_PLACES_API_KEY` in `.env`. Restrict the key to **Websites** and add your referrers (e.g. `http://localhost:*`).

For “Use Current Location” to show a place name instead of coordinates, enable **Geocoding API** as well.

## Weather & AI (Analyze feature)

Weather is loaded in the browser from **Open-Meteo** (historical archive and forecast when needed). No Earth2/Pangu backend is used.

AI recommendations are requested from your API: set `VITE_API_BASE_URL` (see `.env.example`, default `https://api.shaadimausam.in`) to a server that implements `POST /recommendations`. Optional keys in `.env` are for your own integrations if you extend the app.
