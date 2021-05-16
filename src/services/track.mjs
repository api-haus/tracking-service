import { v4 as uuidV4 } from 'uuid';
import { getTracker } from '../store/trackers.mjs';
import { postEvent } from '../store/events.mjs';

export const trackService = (app) => app.post('/track', {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' }
      }
    }
  }
}, async (request, reply) => {
  const { span } = request;
  const { id: trackerId } = request.query;
  // TODO: implement authentication
  const { user_id: userId = uuidV4() } = request.cookies;

  const timestamp = new Date();
  const tracker = await getTracker(trackerId);
  const eventId = uuidV4();

  if (!tracker)
    return reply.code(404).send();

  span.setTag('user.id', userId);
  span.setTag('event.id', eventId);
  span.setTag('tracker.id', trackerId);

  // Post event to Kafka over TCP socket
  await postEvent({
    ip: request.ip,
    url: new URL(request.url, `${request.protocol}://${request.headers.host}`),
    date: timestamp,
    date_time: timestamp,
    value: tracker.value,
    user_id: userId,
    event_id: eventId,
    tracker_id: trackerId,
    user_agent: request.headers['user-agent']
  });

  return reply.code(204)
      .setCookie('user_id', userId)
      .send();
});
