import ms from 'ms';
import LRU from 'lru-cache';

import pg from '../databases/postgres.mjs';

const { TRACKER_CACHE_MAX_AGE } = process.env;
const cache = new LRU({ maxAge: ms(TRACKER_CACHE_MAX_AGE) });

/**
 * Load tracker value from database
 *
 * @param {string} trackerId
 * @return {Promise<{value:string}>}
 */
export async function getTracker(trackerId) {
  const cached = cache.get(trackerId);

  if (cached)
    return cached;

  const { rows: [tracker] } = await pg.query({
    text: 'SELECT value FROM trackers WHERE uuid = $1',
    values: [trackerId]
  });

  cache.set(trackerId, tracker);

  return tracker;
}
