import fastify from 'fastify';
import * as Sentry from '@sentry/node';
import cookieParser from 'fastify-cookie';
import metricsPlugin from 'fastify-metrics';

import logger from './integrations/logger.mjs';
import { tracer } from './integrations/opentracing.mjs';
import tracingPlugin from './plugins/tracing.mjs';
import shutdownPlugin from './plugins/shutdown.mjs';
import { trackService } from './services/track.mjs';
import { statsService } from './services/stats.mjs';

const { COOKIE_SECRET } = process.env;

const app = fastify({ logger });

// Register plugins
app.register(tracingPlugin, {
  tracer,
  syntheticEndpoints: ['/', '/metrics']
});
app.register(cookieParser, {
  secret: COOKIE_SECRET
});
app.register(metricsPlugin, { endpoint: '/metrics' });
app.register(shutdownPlugin, {
  tracer
})
    .after(() => app.shutdown(
        () => tracer.close(),
        () => Sentry.close()
    ));

// Expose basic availability route
app.get('/', async () => {
  return 'OK';
});

// Register service routes
trackService(app);
statsService(app);

export default app;
