/**
 * AI recommendation service for Indian wedding weather (GPT-4o).
 * Generates data-driven, pointer-style recommendations (5-6 bullets per section).
 */
import OpenAI from 'openai';
import type { WeatherData } from '../types/weather';

export interface RecommendationSection {
  fullRecommendation?: string;
  moisturizer?: string;
  dressShoes?: string;
  outdoorVenue?: string;
  indoorVenue?: string;
  warmOptions?: string;
  hotBeverages?: string;
  goldenHour?: string;
  weatherSpecific?: string;
  [key: string]: string | undefined;
}

export interface Recommendations {
  personalHygiene: RecommendationSection;
  venueRecommendations: RecommendationSection;
  localCuisine: RecommendationSection;
  photography: RecommendationSection;
  guestComfort?: RecommendationSection;
}

const DEFAULT_RECOMMENDATIONS: Recommendations = {
  personalHygiene: {
    fullRecommendation: 'Detailed recommendations unavailable. Use a light moisturizer with SPF, hydrate well, and wear comfortable dress shoes for the conditions.',
    moisturizer: 'Use a light moisturizer with SPF. Hydrate well given the weather.',
    dressShoes: 'Comfortable dress shoes suitable for the expected conditions.',
  },
  venueRecommendations: {
    fullRecommendation: 'Detailed recommendations unavailable. Outdoor venues can work with a backup plan; indoor options provide climate control.',
    outdoorVenue: 'Outdoor venues can work well. Have a backup plan for rain.',
    indoorVenue: 'Indoor options provide climate control and weather protection.',
  },
  localCuisine: {
    fullRecommendation: 'Detailed recommendations unavailable. Consider weather-appropriate menu items and hot beverages for guest comfort.',
    warmOptions: 'Consider weather-appropriate menu items for guest comfort.',
    hotBeverages: 'Hot beverages can help guests stay comfortable.',
  },
  photography: {
    fullRecommendation: 'Detailed recommendations unavailable. Golden hour typically 6:00–7:30 AM and 5:30–7:00 PM. Adjust plans based on the forecast.',
    goldenHour: 'Golden hour typically 6:00–7:30 AM and 5:30–7:00 PM. Plan shots accordingly.',
    weatherSpecific: 'Adjust photography plans based on the forecast.',
  },
  guestComfort: {
    fullRecommendation: 'Detailed recommendations unavailable. Arrange shaded waiting areas and AC where needed. Consider elderly and child guest comfort.',
  },
};

function buildPrompt(
  weatherData: WeatherData,
  location: string,
  weddingDate: string,
  suitabilityScore?: number
): string {
  const { temperature, precipitation, humidity, wind, condition, dailyForecasts } = weatherData;
  const firstDay = dailyForecasts.length ? dailyForecasts[0] : null;
  const tempMin = firstDay?.tempMin ?? temperature - 3;
  const tempMax = firstDay?.tempMax ?? temperature;
  const rainChance = firstDay?.rainChance ?? 0;
  const dayHumidity = firstDay?.humidity ?? humidity;
  const windSpeed = firstDay?.wind ?? wind;
  const score = suitabilityScore ?? 85;

  const dayLines = dailyForecasts.length
    ? dailyForecasts
        .map(
          (d) =>
            `  Day ${d.date}: ${d.day} ${d.dateShort} — Temp ${d.tempMin}°–${d.tempMax}°C, Rain ${d.rainChance}%, Humidity ${d.humidity}%, Wind ${d.wind} km/h. ${d.summary}`
        )
        .join('\n')
    : `  Overall: Temp ${temperature}°C, Precipitation ${precipitation}mm, Humidity ${humidity}%, Wind ${wind} km/h. ${condition}`;

  const month = (() => {
    try {
      const d = new Date(weddingDate + 'T12:00:00');
      return d.toLocaleString('en-IN', { month: 'long' });
    } catch {
      return 'the wedding month';
    }
  })();

  return `You are an expert Indian wedding planner. Generate DATA-DRIVEN recommendations as exactly 5-6 short bullet points per section. Base advice on the weather below, but do NOT quote exact numbers in the bullet text.

**RULES:**
- Do NOT include in the recommendation text: specific temperature values (e.g. 32°C, 23.6°–32°C), humidity percentages (e.g. 55% humidity), rain chance or rainfall % (e.g. 0% rain chance, 0% rain forecast), or suitability score (e.g. 100/100 or "suitability score").
- Do NOT include: cost of renting tents, cooling equipment, or number of guests. Omit all pricing and guest-count figures.
- When rain is low/zero: say rain mitigation is optional or minimal—do not stress rain risk. Do not write "0% rain chance" or "0% rain forecast" in bullets.
- For warmth: use phrases like "warm conditions", "peak sun hours", "midday heat", "warm and potentially uncomfortable in direct sun"—never quote exact °C in bullets.
- For humidity/wind: give practical advice (e.g. "breathable fabrics", "shaded areas") without writing "X% humidity" or "X km/h wind" in the bullets.
- Keep each bullet 1-2 sentences. No long paragraphs.

**Wedding Date:** ${weddingDate} (${month})
**Location:** ${location}
**Weather (for your reasoning only; do not repeat these numbers in bullets):** temp ${tempMin}°–${tempMax}°C, rain ${rainChance}%, humidity ${dayHumidity}%, wind ${windSpeed} km/h, condition: ${condition}.

**WEATHER (full detail):**
${dayLines}

---

**1. PERSONAL HYGIENE & COMFORT** — Exactly 5-6 bullet points. Include: sunscreen (product + SPF, reapply timing), evening skincare, fabric/footwear for the conditions, hydration (e.g. ORS), what to carry (sunglasses, portable fan). Do not mention temperature in °C or humidity % in the text.

**2. VENUE RECOMMENDATIONS** — Exactly 5-6 bullet points. Include: outdoor suitability, tent positioning (north side, avoid afternoon sun), misting fans, backup venue name and distance only (no cost, no guest capacity). When rain is low, state that rain mitigation is optional/minimal. Do not write rain % or wind speed in bullets. Do NOT include cost of tents, cooling, or number of guests.

**3. LOCAL CUISINE SUGGESTIONS** — Exactly 5-6 bullet points. Include: 2-3 regional dishes per category (starters, main, beverages, desserts), why they suit the weather, serving timing (e.g. live counters, dinner when it cools). Do not quote temperature in °C.

**4. PHOTOGRAPHY OPPORTUNITIES** — Exactly 5-6 bullet points. Include: golden hour windows (morning/evening), 2-3 location names with distance/timing (no entry cost if possible), note that wind can help dupatta/drone shots; say midday is "warm and potentially uncomfortable in direct sun". Do not write wind speed or temperature in °C in bullets.

**5. GUEST COMFORT** — Exactly 5-6 bullet points. Include: AC/shaded areas, waiting areas, elderly (wheelchairs, rest area), children's play area. Do not mention suitability score or rain % in bullets.

---

Return ONLY valid JSON (no markdown, no \`\`\`). Each "fullRecommendation" must be a single string with exactly 5-6 bullet points separated by newlines (use "\\n" for newline inside the string). Example format for one section: "• Outdoor setup is low risk given the forecast.\\n• Position tent north to avoid afternoon sun.\\n• ..."
{
  "personalHygiene": { "fullRecommendation": "• ...\\n• ...\\n• ...\\n• ...\\n• ..." },
  "venueRecommendations": { "fullRecommendation": "• ...\\n• ...\\n• ...\\n• ...\\n• ..." },
  "localCuisine": { "fullRecommendation": "• ...\\n• ...\\n• ...\\n• ...\\n• ..." },
  "photography": { "fullRecommendation": "• ...\\n• ...\\n• ...\\n• ...\\n• ..." },
  "guestComfort": { "fullRecommendation": "• ...\\n• ...\\n• ...\\n• ...\\n• ..." }
}

Use real city/region from location (e.g. Jaipur, Mumbai, Delhi). Use real product and venue names. No costs, no guest counts. No temperature °C, no humidity %, no rain %, no suitability score in the bullet text.`;
}

function parseRecommendations(text: string): Recommendations {
  try {
    if (!text || typeof text !== 'string') return DEFAULT_RECOMMENDATIONS;
    const trimmed = text.trim();
    // Extract JSON: remove markdown code blocks, then find first { to last }
    let cleaned = trimmed.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }
    const parsed = JSON.parse(cleaned) as Record<string, unknown>;

    const getSection = (key: string, defaultSection: RecommendationSection): RecommendationSection => {
      const raw = parsed[key];
      if (raw && typeof raw === 'object' && raw !== null && 'fullRecommendation' in raw) {
        return { ...defaultSection, ...(raw as RecommendationSection) };
      }
      if (raw && typeof raw === 'object' && raw !== null) {
        return { ...defaultSection, ...(raw as Record<string, string>) };
      }
      return defaultSection;
    };

    return {
      personalHygiene: getSection('personalHygiene', DEFAULT_RECOMMENDATIONS.personalHygiene),
      venueRecommendations: getSection('venueRecommendations', DEFAULT_RECOMMENDATIONS.venueRecommendations),
      localCuisine: getSection('localCuisine', DEFAULT_RECOMMENDATIONS.localCuisine),
      photography: getSection('photography', DEFAULT_RECOMMENDATIONS.photography),
      guestComfort: getSection('guestComfort', DEFAULT_RECOMMENDATIONS.guestComfort!),
    };
  } catch (parseErr) {
    console.warn('Recommendations parse failed:', parseErr);
    console.warn('Response preview:', String(text).slice(0, 500));
    return DEFAULT_RECOMMENDATIONS;
  }
}

/**
 * Get AI recommendations for the wedding based on weather and location (GPT-4o).
 */
export async function getRecommendations(
  weatherData: WeatherData,
  location: string,
  weddingDate: string,
  suitabilityScore?: number
): Promise<Recommendations> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  const key = apiKey?.trim();

  if (!key) {
    console.warn('OpenAI API key missing. Set VITE_OPENAI_API_KEY in .env and restart the dev server.');
    return DEFAULT_RECOMMENDATIONS;
  }

  try {
    const client = new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });
    const prompt = buildPrompt(weatherData, location, weddingDate, suitabilityScore);

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 6144,
      response_format: { type: 'json_object' },
    });

    const rawContent = completion.choices[0]?.message?.content;
    // Handle both string and array (multimodal) response
    let text = '';
    if (typeof rawContent === 'string') {
      text = rawContent;
    } else if (Array.isArray(rawContent)) {
      const parts = rawContent as Array<{ text?: string } | unknown>;
      const textPart = parts.find((p: unknown) => p && typeof p === 'object' && 'text' in p);
      text = (textPart as { text?: string } | undefined)?.text ?? '';
    }
    return parseRecommendations(text);
  } catch (err) {
    console.warn('OpenAI API failed, using defaults:', err);
    return DEFAULT_RECOMMENDATIONS;
  }
}
