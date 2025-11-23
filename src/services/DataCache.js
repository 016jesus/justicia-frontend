// Simple namespaced cache (memory + localStorage) with TTL
// Namespace is derived from current user email to avoid cross-user leaks

const memoryCache = new Map(); // key -> { expiry: number, data: any }

const LS_PREFIX = 'cache:v1:';

function getNamespace() {
  try {
    return localStorage.getItem('email') || 'anon';
  } catch {
    return 'anon';
  }
}

function buildKey(ns, key) {
  return `${LS_PREFIX}${ns}::${key}`;
}

function now() {
  return Date.now();
}

export function getCached(key, { namespace } = {}) {
  const ns = namespace || getNamespace();
  const fullKey = buildKey(ns, key);

  // memory first
  const mem = memoryCache.get(fullKey);
  if (mem) {
    if (mem.expiry === 0 || mem.expiry > now()) return mem.data;
    memoryCache.delete(fullKey);
  }

  // localStorage
  try {
    const raw = localStorage.getItem(fullKey);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== 'object') {
      localStorage.removeItem(fullKey);
      return null;
    }
    if (obj.expiry && obj.expiry > 0 && obj.expiry <= now()) {
      localStorage.removeItem(fullKey);
      return null;
    }
    // hydrate memory for fast access next time
    memoryCache.set(fullKey, { expiry: obj.expiry || 0, data: obj.data });
    return obj.data;
  } catch {
    return null;
  }
}

export function setCached(key, data, { ttlMs = 120000, namespace } = {}) {
  const ns = namespace || getNamespace();
  const fullKey = buildKey(ns, key);
  const expiry = ttlMs && ttlMs > 0 ? now() + ttlMs : 0;
  // memory
  memoryCache.set(fullKey, { expiry, data });
  // localStorage
  try {
    localStorage.setItem(fullKey, JSON.stringify({ expiry, data }));
  } catch {
    // ignore storage errors (quota, etc.)
  }
}

export function invalidateCached(predicate, { namespace } = {}) {
  const ns = namespace || getNamespace();
  const prefix = `${LS_PREFIX}${ns}::`;
  // memory
  for (const k of Array.from(memoryCache.keys())) {
    if (k.startsWith(prefix)) {
      const shortKey = k.slice(prefix.length);
      if (predicate(shortKey)) memoryCache.delete(k);
    }
  }
  // localStorage
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(prefix)) continue;
      const shortKey = k.slice(prefix.length);
      if (predicate(shortKey)) localStorage.removeItem(k);
    }
  } catch {
    // ignore
  }
}

export function invalidateByPrefix(prefix, opts) {
  const p = String(prefix || '');
  return invalidateCached((k) => k.startsWith(p), opts);
}

export function clearNamespace(opts) {
  const ns = (opts && opts.namespace) || getNamespace();
  const prefix = `${LS_PREFIX}${ns}::`;
  for (const k of Array.from(memoryCache.keys())) {
    if (k.startsWith(prefix)) memoryCache.delete(k);
  }
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) localStorage.removeItem(k);
    }
  } catch {}
}

export function buildCacheKey(url, params) {
  // params is expected to be serializable; simplest approach: JSON stringify
  if (!params || Object.keys(params).length === 0) return url;
  try {
    return `${url}::${JSON.stringify(params)}`;
  } catch {
    return url;
  }
}
