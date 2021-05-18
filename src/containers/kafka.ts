import { Kafka } from 'kafkajs';
import { ContainerModule, interfaces } from "inversify";

import { DB } from "@/types";

const {
  KAFKA_BROKERS,
  KAFKA_CLIENT_ID = 'tracker-service'
} = process.env;

export const kafkaContainer = new ContainerModule((bind: interfaces.Bind) => {
  const kafka = new Kafka({
    clientId: KAFKA_CLIENT_ID,
    brokers: KAFKA_BROKERS.split(',')
  });

  bind(DB.KafkaProducer).toDynamicValue(async () => {
    const producer = kafka.producer();
    await producer.connect();
    return producer;
  });
});
