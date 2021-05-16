import opentracing from 'opentracing';
import promClient from 'prom-client';
import jaeger from 'jaeger-client';
import { promises as fs } from 'fs';
import logger from './logger.mjs';

const {
  JAEGER_SERVICE_NAME: serviceName
} = process.env;

const metrics = new jaeger.PrometheusMetricsFactory(promClient, serviceName);

const config = { serviceName };
const options = {
  tags: {
    'service.version': JSON.parse(await fs.readFile('./package.json')).version
  },
  metrics,
  logger
};

export const tracer = jaeger.initTracerFromEnv(config, options);

opentracing.initGlobalTracer(tracer);
