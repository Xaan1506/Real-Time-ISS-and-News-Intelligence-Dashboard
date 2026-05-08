import { httpClient } from './httpClient';

const AI_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';
const FALLBACK = 'I can only answer questions related to ISS tracking and dashboard news data.';

function parseInferenceText(data) {
  if (Array.isArray(data)) {
    return data[0]?.generated_text?.trim();
  }
  return data?.generated_text?.trim();
}

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isDashboardQuestion(prompt) {
  const text = prompt.toLowerCase();
  return (
    /\biss\b|\borbit\b|\blatitude\b|\blongitude\b|\bspeed\b|\btracking\b/.test(text) ||
    /\bnews\b|\bheadline\b|\barticle\b|\bsource\b|\bcategory\b/.test(text) ||
    /astronaut|people.*space|space.*people|how many.*space/.test(text)
  );
}

function buildGroundedFallbackAnswer(prompt, context) {
  const text = prompt.toLowerCase();
  const iss = context.iss || {};
  const speed = context.speed;
  const astronauts = context.astronauts || { number: 0, people: [] };
  const news = Array.isArray(context.news) ? context.news : [];

  if (/current.*speed|iss.*speed|how fast/.test(text)) {
    if (Number.isFinite(speed) && speed > 0) {
      return `Current ISS speed is approximately ${Number(speed).toLocaleString()} km/h.`;
    }
  }

  if (/where|location|latitude|longitude|position/.test(text)) {
    if (Number.isFinite(iss.latitude) && Number.isFinite(iss.longitude)) {
      return `ISS current location is latitude ${iss.latitude.toFixed(3)} and longitude ${iss.longitude.toFixed(3)}.`;
    }
  }

  if (/how many.*(astronaut|people)|number.*(astronaut|people)|people.*in space|astronaut.*in space/.test(text)) {
    return `There are currently ${astronauts.number || 0} people in space in the dashboard data.`;
  }

  if (/astronaut|people.*space|space.*people/.test(text)) {
    const names = (astronauts.people || []).slice(0, 8).map((p) => p.name).filter(Boolean);
    if (names.length > 0) {
      return `Astronauts currently shown in the dashboard include: ${names.join(', ')}.`;
    }
  }

  if (/news|headline|article/.test(text)) {
    if (news.length > 0) {
      const top = news.slice(0, 3).map((n) => n.title).filter(Boolean);
      if (top.length > 0) {
        return `Top dashboard news headlines right now: ${top.join(' | ')}.`;
      }
    }
  }

  return null;
}

export async function askDashboardAI(prompt, context) {
  if (!isDashboardQuestion(prompt)) {
    return FALLBACK;
  }

  const token = import.meta.env.VITE_AI_TOKEN;
  if (!token) {
    return buildGroundedFallbackAnswer(prompt, context) || FALLBACK;
  }

  const constrainedPrompt = `You are an assistant for this dashboard only.
Rules:
1) Answer only from the provided JSON context.
2) If the answer is unavailable in context, reply exactly: ${FALLBACK}
3) Keep answer concise and factual.
4) If asked "how many people/astronauts are in space", use astronauts.number from context.
5) If asked ISS location, use iss.latitude and iss.longitude from context.
6) If asked ISS speed, use speed from context.

Context JSON:
${JSON.stringify(context, null, 2)}

User question:
${prompt}`;

  const payload = {
    inputs: constrainedPrompt,
    parameters: { max_new_tokens: 220, temperature: 0.2, return_full_text: false },
  };
  const config = { headers: { Authorization: `Bearer ${token}` } };

  try {
    const { data } = await httpClient.post(AI_URL, payload, config);
    const text = parseInferenceText(data);
    if (!text) {
      return buildGroundedFallbackAnswer(prompt, context) || FALLBACK;
    }
    if (text.trim() === FALLBACK) {
      return buildGroundedFallbackAnswer(prompt, context) || FALLBACK;
    }
    return text;
  } catch (error) {
    const message = error?.response?.data?.error || '';
    const waitFor = Number(error?.response?.data?.estimated_time);

    if (message.toLowerCase().includes('loading') && Number.isFinite(waitFor) && waitFor > 0) {
      try {
        await wait(Math.min(waitFor * 1000, 15000));
        const { data } = await httpClient.post(AI_URL, payload, config);
        const text = parseInferenceText(data);
        if (!text || text.trim() === FALLBACK) {
          return buildGroundedFallbackAnswer(prompt, context) || FALLBACK;
        }
        return text;
      } catch {
        return buildGroundedFallbackAnswer(prompt, context) || FALLBACK;
      }
    }

    return buildGroundedFallbackAnswer(prompt, context) || FALLBACK;
  }
}
