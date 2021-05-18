import { inject, injectable } from "inversify";

import { EventStats, EventStatsProvider } from "@/store/event-stats.class";

interface StatsParams {
  trackerId: string
  fromDate?: Date
  toDate?: Date
}

@injectable()
export class StatsService {
  @inject("EventStatsProvider")
  private eventStats: EventStatsProvider;

  async stats(params: StatsParams): Promise<EventStats> {
    const { trackerId, fromDate, toDate } = params;

    return this.eventStats.eventStats({
      trackerId,
      fromDate,
      toDate
    });
  }
}
