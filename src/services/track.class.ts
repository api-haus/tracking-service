import { inject, injectable } from "inversify";

import { formatISODate, formatISODateTime } from "@/utils/clickhouse";
import { TrackerStore } from "@/store";
import { EventStore } from "@/store/event-store.class";

interface TrackParams {
  trackerId: string;
  eventId: string;
  userId?: string;
  ip: string;
  url: string;
  userAgent: string;
}

@injectable()
export class TrackService {
  @inject("TrackerStore")
  private trackerStore: TrackerStore;
  @inject("EventStore")
  private eventStore: EventStore;

  async track(params: TrackParams): Promise<boolean> {
    const {
      ip,
      url,
      userAgent,
      userId,
      eventId,
      trackerId
    } = params;

    const timestamp = new Date();
    const tracker = await this.trackerStore.getTracker(trackerId);

    if (!tracker)
      return false;

    await this.eventStore.postEvent({
      ip,
      url,
      date: formatISODate(timestamp),
      date_time: formatISODateTime(timestamp),
      value: tracker.value,
      user_id: userId,
      event_id: eventId,
      tracker_id: trackerId,
      user_agent: userAgent
    });

    return true;
  }
}
