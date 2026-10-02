
const cache = new Map();


const TTL_MS = 60 * 1000;


function getCacheKey(req) {
  const fullUrl = req.originalUrl || req.url;
  const [pathname, search] = fullUrl.split('?');
  const normalizedPath = pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;
  return search ? `${normalizedPath}?${search}` : normalizedPath;
}

function clearCache(pattern) {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.startsWith(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
}

function cacheMiddleware(req, res, next) {
  if (req.method === 'GET') {
    const key = getCacheKey(req);
    const cachedEntry = cache.get(key);
    const now = Date.now();

    if (cachedEntry) {
      const isExpired = (now - cachedEntry.createdAt) > TTL_MS;

      if (!isExpired) {
        res.setHeader('X-Cache', 'HIT');
        return res.json(cachedEntry.data);
      }

      cache.delete(key);
    }

    res.setHeader('X-Cache', 'MISS');

    const originalJson = res.json.bind(res);
    res.json = function (body) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(key, {
          data: body,
          createdAt: Date.now()
        });
      }
      return originalJson(body);
    };

    return next();
  }

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return invalidateCacheMiddleware(req, res, next);
  }

  next();
}

function invalidateCacheMiddleware(req, res, next) {
  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);
  const originalEnd = res.end.bind(res);

  let hasInvalidated = false;
  const triggerInvalidation = () => {
    if (!hasInvalidated && res.statusCode >= 200 && res.statusCode < 300) {
      hasInvalidated = true;
      clearCache();
    }
  };

  res.json = function (body) {
    triggerInvalidation();
    return originalJson(body);
  };

  res.send = function (body) {
    triggerInvalidation();
    return originalSend(body);
  };

  res.end = function (...args) {
    triggerInvalidation();
    return originalEnd(...args);
  };

  next();
}

module.exports = {
  cacheMiddleware,
  invalidateCacheMiddleware,
  clearCache,
  cache,
  TTL_MS,
  getCacheKey
};
