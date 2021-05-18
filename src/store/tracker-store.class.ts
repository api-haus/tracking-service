import pg from 'pg';
import ms from 'ms';
import LRUCache from "lru-cache";
import AsyncLock from 'async-lock';
import { inject, injectable } from "inversify";

import { DB } from "@/types";

export declare type Tracker = {
  value: string
};

const { TRACKER_CACHE_MAX_AGE } = process.env;

@injectable()
export class TrackerStore {
  private lock = new AsyncLock();
  private cache = new LRUCache<string, Tracker>({ maxAge: ms(TRACKER_CACHE_MAX_AGE) });
  @inject(DB.PostgreSQL)
  private postgres: Promise<pg.Client>;

  /**
   * Load tracker by ID
   *
   * @param id tracker id
   * @return {Promise<*>}
   */
  async getTracker(id: string): Promise<Tracker> {
    let tracker = this.cache.get(id);

    if (!tracker)
      await this.lock.acquire(id, async () => {
        tracker = this.cache.get(id);
        if (tracker)
          return;

        const { rows } = await (await this.postgres).query({
          text: 'SELECT value FROM trackers WHERE uuid = $1',
          values: [id]
        });

        [tracker] = rows;
        this.cache.set(id, tracker);
      });

    return tracker;
  }
}
