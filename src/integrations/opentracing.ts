import { initGlobalTracer } from 'opentracing';
import promClient from 'prom-client';
import jaeger from 'jaeger-client';

import logger from './logger';

const {
  JAEGER_SERVICE_NAME: serviceName = 'service'
} = process.env;

const metrics = new jaeger.PrometheusMetricsFactory(promClient, serviceName);

const config = { serviceName };
const options = {
  metrics,
  logger
};

export const tracer = jaeger.initTracerFromEnv(config, options);

initGlobalTracer(tracer);
