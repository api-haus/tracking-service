import { Producer } from "kafkajs";
import fastJson from "fast-json-stringify";
import { inject, injectable } from "inversify";

import { DB } from "@/types";
import { eventSchema } from "@/schemas/event";

const { EVENTS_TOPIC } = process.env;

const stringifyEvent = fastJson(eventSchema);

interface EventData {
  date: string
  date_time: string
  event_id: string
  tracker_id: string
  ip: string
  url: string
  user_id: string
  user_agent: string
  value: string
}

@injectable()
export class EventStore {
  @inject(DB.KafkaProducer)
  private producer: Producer;

  async postEvent(eventData: EventData): Promise<void> {
    await (await this.producer).send({
      topic: EVENTS_TOPIC,
      messages: [{ value: stringifyEvent(eventData) }]
    });
  }
}
