import * as Sentry from '@sentry/node';

const { SENTRY_DSN } = process.env;

Sentry.init({
  dsn: SENTRY_DSN
});

export default Sentry;
