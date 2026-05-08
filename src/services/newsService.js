import { httpClient } from './httpClient';

const BASE_URL = 'https://newsdata.io/api/1/news';

function normalizeArticle(article) {
  return {
    id: article.article_id || article.link,
    title: article.title || 'Untitled',
    description: article.description || 'No description available',
    source: article.source_id || 'Unknown source',
    author: article.creator?.[0] || 'Unknown',
    image: article.image_url,
    link: article.link,
    pubDate: article.pubDate,
    category: article.category?.[0] || 'world',
  };
}

export async function fetchNews(category = '') {
  const key = import.meta.env.VITE_NEWS_API_KEY;
  if (!key) {
    throw new Error('Missing VITE_NEWS_API_KEY');
  }

  const params = {
    apikey: key,
    language: 'en',
    size: 10,
  };

  if (category) {
    params.category = category;
  }

  const { data } = await httpClient.get(BASE_URL, { params });

  if (!data.results || !Array.isArray(data.results)) {
    return [];
  }

  return data.results.map(normalizeArticle);
}
