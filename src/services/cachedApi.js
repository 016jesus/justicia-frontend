import apiClient from './APIClient';
import { getCached, setCached, buildCacheKey, invalidateByPrefix } from './DataCache';

const DEFAULT_TTL = 120000; // 2 minutes

export async function cachedGet(url, config = {}, options = {}) {
  const { ttlMs = DEFAULT_TTL, forceRefresh = false, cacheKey: customKey } = options;
  const key = customKey || buildCacheKey(url, config && config.params);

  if (!forceRefresh) {
    const cached = getCached(key);
    if (cached !== null && cached !== undefined) {
      return { data: cached, fromCache: true };
    }
  }

  const res = await apiClient.get(url, config);
  const data = res && res.data !== undefined ? res.data : res;
  setCached(key, data, { ttlMs });
  return { data, fromCache: false };
}

export function invalidateCacheByPrefix(prefix) {
  invalidateByPrefix(prefix);
}
