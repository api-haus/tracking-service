import { Kafka } from 'kafkajs';

const {
  KAFKA_BROKERS,
  KAFKA_CLIENT_ID = 'tracker-service'
} = process.env;

export default new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: KAFKA_BROKERS.split(',')
});
