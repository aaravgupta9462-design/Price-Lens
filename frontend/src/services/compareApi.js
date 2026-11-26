/**
 * PriceLens Comparison API Service
 * 
 * Communicates with backend /v1/compare endpoint for real-time
 * multi-store price comparisons.
 * NOTE: No API keys are kept in the frontend. All credentials are secure on the backend.
 */

const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
// Normalize base URL: strip trailing slashes and trailing /v1 to avoid duplicate path segments
const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '').replace(/\/v1$/, '');

/**
 * Search and compare offers across stores in real-time
 * @param {string} query - Product search keyword (e.g. 'iphone 15')
 * @returns {Promise<Object>} Backend response data (offers, bestDeal, filterStats, lowConfidence, confidenceMessage, etc.)
 */
export async function searchCompare(query) {
  const cleanQuery = String(query || '').trim();
  if (cleanQuery.length < 2) {
    throw new Error('Search query must be at least 2 characters long.');
  }

  const url = `${API_BASE_URL}/v1/compare?q=${encodeURIComponent(cleanQuery)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.message || `Backend error (${response.status})`;
    throw new Error(message);
  }

  const json = await response.json();
  if (!json.success || !json.data) {
    throw new Error(json.message || 'Comparison response was invalid.');
  }

  return json.data;
}

export default {
  searchCompare
};
