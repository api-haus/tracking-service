import fp from 'fastify-plugin';
import { parse as parseUrl } from 'url';
import {
  FORMAT_HTTP_HEADERS,
  FORMAT_TEXT_MAP,
  globalTracer,
  Tags,
  Tracer
} from 'opentracing';

interface TracingOptions {
  tracer: Tracer
  syntheticEndpoints: string[]
}

// Adapted from 'express-opentracing'
export default fp<TracingOptions>(async (fastify, options) => {
  const {
    tracer = globalTracer(),
    syntheticEndpoints = []
  } = options;

  const synthetic = toHash(syntheticEndpoints);

  fastify.decorateRequest('span', null);
  fastify.addHook('onRequest', async (request, reply) => {
    const { url, method, headers } = request;

    if (url in synthetic)
      return;

    const { pathname } = parseUrl(url);

    const wireCtx = tracer.extract(FORMAT_HTTP_HEADERS, headers);
    const span = tracer.startSpan(pathname, { childOf: wireCtx });

    span.logEvent('request_received', null);

    span.setTag(Tags.HTTP_METHOD, method);
    span.setTag(Tags.SPAN_KIND, 'server');
    span.setTag(Tags.HTTP_URL, url);

    // include trace ID in headers so that we can debug slow requests we see in
    // the browser by looking up the trace ID found in response headers
    const tracingHeaders = {};
    tracer.inject(span, FORMAT_TEXT_MAP, tracingHeaders);
    reply.headers(tracingHeaders);

    Object.assign(request, { span });
  });

  fastify.addHook('onSend', async (request, reply) => {
    const { url, span } = request;
    const { statusCode } = reply;

    if (!span)
      return;

    span.logEvent('response_finished', null);

    if (statusCode >= 500) {
      span.setTag(Tags.SAMPLING_PRIORITY, 1);
      span.setTag(Tags.ERROR, true);
    }

    span.setTag(Tags.HTTP_STATUS_CODE, statusCode);
    span.setOperationName(url);
  });

  fastify.addHook('onResponse', async (request, reply) => {
    const { span } = request;

    if (!span)
      return;

    span.logEvent('response_closed', null);
    span.finish();
  });
});

/**
 * Convert list of endpoints to hashmap
 *
 * @param {string[]}endpoints
 * @return {object}
 */
function toHash(endpoints) {
  const map = {};

  for (const endpoint of endpoints)
    map[endpoint] = undefined;

  return map;
}
