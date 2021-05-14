export const eventSchema = {
  type: 'object',
  properties: {
    date: { type: 'string', format: 'date' },
    date_time: { type: 'string', format: 'date-time' },
    event_id: { type: 'string' },
    tracker_id: { type: 'string' },
    ip: { type: 'string' },
    url: { type: 'string' },
    user_id: { type: 'string' },
    user_agent: { type: 'string' },
    value: { type: 'string' }
  }
};
