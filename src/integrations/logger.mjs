import pino from 'pino';

const { LOG_LEVEL = 'info' } = process.env;

export default pino({
  level: LOG_LEVEL
});
