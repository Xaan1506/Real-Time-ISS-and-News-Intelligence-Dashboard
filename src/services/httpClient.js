import axios from 'axios';

export const httpClient = axios.create({ timeout: 12000 });

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config || config.__retryCount >= 2) {
      return Promise.reject(error);
    }
    config.__retryCount = (config.__retryCount || 0) + 1;
    await new Promise((resolve) => setTimeout(resolve, 700 * config.__retryCount));
    return httpClient(config);
  },
);
