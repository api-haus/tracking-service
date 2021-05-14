import fastJson from 'fast-json-stringify';

import kafka from '../databases/kafka.mjs';
import logger from '../integrations/logger.mjs';
import clickhouse from '../databases/clickhouse.mjs';
import { eventSchema } from '../schemas/event.mjs';

const formatISODate = (iso) => `${iso.substr(0, 10)}`;
const formatISODateTime = (iso) => `${iso.substr(0, 10)} ${iso.substr(11, 8)}`;
const stringifyEvent = fastJson(eventSchema);

const { EVENTS_TOPIC } = process.env;
const producer = kafka.producer();
await producer.connect();

/**
 * Postpone sending event via Kafka Producer Stream
 *
 * @param {object} eventParams
 * @return {Promise<void>}
 */
export async function postEvent(eventParams) {
  // Format dates
  Object.assign(eventParams, {
    date: formatISODate(eventParams.date.toISOString()),
    date_time: formatISODateTime(eventParams.date_time.toISOString())
  });

  logger.debug('send event %O', eventParams);

  await producer.send({
    topic: EVENTS_TOPIC,
    messages: [{ value: stringifyEvent(eventParams) }]
  });
}

/**
 * Count events by trackerId in date range
 *
 * @param {string} trackerId
 * @param {Date} fromDate
 * @param {Date} toDate
 * @return {Promise<{count: number}>}
 */
export async function eventStats({ trackerId, fromDate, toDate }) {
  const [from, to] = [
    formatISODateTime(fromDate.toISOString()),
    formatISODateTime(toDate.toISOString())
  ];

  const queryString = `SELECT count() AS count
                       FROM tracking_events
                       WHERE date_time BETWEEN '${from}' AND '${to}'`;

  const [{ count }] = await clickhouse.query(queryString).toPromise();

  return { count };
}
