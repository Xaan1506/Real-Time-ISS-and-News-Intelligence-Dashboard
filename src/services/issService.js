import { httpClient } from './httpClient';

const ALL_ORIGINS_BASE = 'https://api.allorigins.win/raw?url=';
const OPEN_NOTIFY_BASE = 'http://api.open-notify.org';

function ensureJson(data) {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  return data ?? {};
}

function normalizeIssPayload(raw) {
  const parsed = ensureJson(raw);
  const latitude = Number(parsed.iss_position?.latitude ?? parsed.latitude);
  const longitude = Number(parsed.iss_position?.longitude ?? parsed.longitude);
  const timestamp = Number(parsed.timestamp);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || !Number.isFinite(timestamp)) {
    throw new Error('Invalid ISS payload');
  }

  return { latitude, longitude, timestamp };
}

async function tryRequest(candidates) {
  let lastError;
  for (const request of candidates) {
    try {
      const data = await request();
      if (data) return data;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('All ISS providers failed');
}

export async function fetchIssLocation() {
  return tryRequest([
    async () => {
      const source = encodeURIComponent(`${OPEN_NOTIFY_BASE}/iss-now.json?t=${Date.now()}`);
      const { data } = await httpClient.get(`${ALL_ORIGINS_BASE}${source}`, { timeout: 5000 });
      return normalizeIssPayload(data);
    },
    async () => {
      const source = encodeURIComponent(`${OPEN_NOTIFY_BASE}/iss-now.json?t=${Date.now()}`);
      const { data } = await httpClient.get(`https://api.allorigins.win/get?url=${source}`, { timeout: 5000 });
      return normalizeIssPayload(data?.contents);
    },
    async () => {
      const { data } = await httpClient.get(`https://corsproxy.io/?${encodeURIComponent(`${OPEN_NOTIFY_BASE}/iss-now.json?t=${Date.now()}`)}`, { timeout: 5000 });
      return normalizeIssPayload(data);
    },
    async () => {
      const { data } = await httpClient.get('https://api.wheretheiss.at/v1/satellites/25544', { timeout: 5000 });
      return normalizeIssPayload(data);
    },
  ]);
}

export async function fetchPeopleInSpace() {
  const parsed = await tryRequest([
    async () => {
      const source = encodeURIComponent(`${OPEN_NOTIFY_BASE}/astros.json?t=${Date.now()}`);
      const { data } = await httpClient.get(`${ALL_ORIGINS_BASE}${source}`);
      return ensureJson(data);
    },
    async () => {
      const source = encodeURIComponent(`${OPEN_NOTIFY_BASE}/astros.json?t=${Date.now()}`);
      const { data } = await httpClient.get(`https://api.allorigins.win/get?url=${source}`);
      return ensureJson(data?.contents);
    },
    async () => {
      const { data } = await httpClient.get('https://ll.thespacedevs.com/2.2.0/astronaut/?in_space=true&limit=50');
      const people = (data.results || []).map((item) => ({
        name: item.name,
        craft: item.flights?.[0]?.spacecraft?.name || 'In Orbit',
      }));
      return { number: people.length, people };
    },
  ]);

  return {
    number: Number(parsed.number || 0),
    people: Array.isArray(parsed.people) ? parsed.people : [],
  };
}

export async function reverseGeocode(lat, lon) {
  try {
    const { data } = await httpClient.get(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=4`,
      {
        headers: {
          'Accept-Language': 'en',
        },
      },
    );
    const addr = data.address || {};
    const city = addr.city || addr.town || addr.village || addr.county;
    const country = addr.country;
    if (!city && !country) {
      return 'Over Ocean / Remote Area';
    }
    return [city, country].filter(Boolean).join(', ');
  } catch {
    return 'Over Ocean / Remote Area';
  }
}
