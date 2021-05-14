import { eventStats } from '../store/events.mjs';

export const statsService = (app) => app.get('/stats', {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        from: {
          type: 'string',
          oneOf: [{ format: 'date' }, { format: 'date-time' }]
        },
        to: {
          type: 'string',
          oneOf: [{ format: 'date' }, { format: 'date-time' }]
        }
      }
    }
  }
}, async (request, reply) => {
  const { id: trackerId, from, to } = request.query;

  const { count } = await eventStats({
    trackerId,
    fromDate: new Date(from),
    toDate: new Date(to)
  });

  return { count };
});
