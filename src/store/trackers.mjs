import ms from 'ms';
import LRU from 'lru-cache';
import AsyncLock from 'async-lock';

import pg from '../databases/postgres.mjs';

const { TRACKER_CACHE_MAX_AGE } = process.env;
const cache = new LRU({ maxAge: ms(TRACKER_CACHE_MAX_AGE) });
const lock = new AsyncLock();

/**
 * Load tracker value from database
 *
 * @param {string} trackerId
 * @return {Promise<{value:string}>}
 */
export async function getTracker(trackerId) {
  let tracker = cache.get(trackerId);

  if (!tracker) {
    await lock.acquire(trackerId, async () => {
      tracker = cache.get(trackerId);
      if (tracker)
        return;

      const { rows } = await pg.query({
        text: 'SELECT value FROM trackers WHERE uuid = $1',
        values: [trackerId]
      });

      [tracker] = rows;
      cache.set(trackerId, tracker);
    });
  }

  return tracker;
}
