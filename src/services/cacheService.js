/**
 * Cache Service - Preload and cache data in localStorage
 */

const CACHE_KEYS = {
  SALES_DATA: 'smoocho_sales_cache',
  EXPENSE_DATA: 'smoocho_expense_cache',
  LAST_SYNC: 'smoocho_last_sync',
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Save data to cache
 */
export const cacheData = (key, data) => {
  try {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheEntry));
  } catch (err) {
    console.error('Failed to cache data:', err);
  }
};

/**
 * Get data from cache
 */
export const getCachedData = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    
    // Check if cache is still valid
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
    
    // Cache expired
    localStorage.removeItem(key);
    return null;
  } catch (err) {
    console.error('Failed to get cached data:', err);
    return null;
  }
};

/**
 * Clear all cache
 */
export const clearCache = () => {
  Object.values(CACHE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

/**
 * Check if cache is fresh (< 1 minute old)
 */
export const isCacheFresh = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return false;

    const { timestamp } = JSON.parse(cached);
    return Date.now() - timestamp < 60000; // 1 minute
  } catch {
    return false;
  }
};

export { CACHE_KEYS };

