import opentracing from 'opentracing';
import jaeger from 'jaeger-client';
import promClient from 'prom-client';
import { promises as fs } from 'fs';

import logger from './logger.mjs';

const { JAEGER_SERVICE_NAME: serviceName } = process.env;

const metrics = new jaeger.PrometheusMetricsFactory(promClient, serviceName);

export const tracer = jaeger.initTracerFromEnv({
  serviceName
}, {
  tags: {
    'service.version': JSON.parse(await fs.readFile('./package.json')).version
  },
  metrics,
  logger: logger
});
opentracing.initGlobalTracer(tracer);
