import { ClickHouse } from "clickhouse";
import { inject, injectable } from "inversify";

import { DB } from "@/types";
import { formatISODateTime } from "@/utils/clickhouse";

interface EventStatsQuery {
  trackerId?: string
  fromDate?: Date
  toDate?: Date
}

export interface EventStats {
  count: number
}

@injectable()
export class EventStatsProvider {
  @inject(DB.ClickHouse)
  private clickhouse: ClickHouse;

  async eventStats(query: EventStatsQuery): Promise<EventStats> {
    const queryString = EventStatsProvider.statsQuery(query);

    const [{ count }] = await this.clickhouse.query(queryString).toPromise();

    return { count };
  }

  private static statsQuery(query: EventStatsQuery): string {
    const { trackerId, fromDate, toDate } = query;

    const filter = [];

    if (trackerId)
      filter.push(`(tracker_id = '${trackerId}')`);
    if (fromDate)
      filter.push(`(date_time >= '${formatISODateTime(fromDate)}')`);
    if (toDate)
      filter.push(`(date_time <= '${formatISODateTime(toDate)}')`);

    return [
      `SELECT count() AS count
       FROM tracking_events`,
      filter.join(' AND ')
    ].join(' WHERE ');
  }
}
