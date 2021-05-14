import fp from 'fastify-plugin';
import opentracing from 'opentracing';
import { parse as parseUrl } from 'url';

// Adapted from 'express-opentracing'

export default fp((fastify, options, done) => {
  const {
    tracer = opentracing.globalTracer(),
    syntheticEndpoints = []
  } = options;

  const synthetic = toHash(syntheticEndpoints);

  fastify.decorateRequest('span', null);
  fastify.addHook('onRequest', async (request, reply) => {
    const { url, method, headers } = request;

    if (url in synthetic)
      return;

    const { pathname } = parseUrl(url);

    const wireCtx = tracer.extract(opentracing.FORMAT_HTTP_HEADERS, headers);
    const span = tracer.startSpan(pathname, { childOf: wireCtx });

    span.logEvent('request_received');

    span.setTag(opentracing.Tags.HTTP_METHOD, method);
    span.setTag(opentracing.Tags.SPAN_KIND, 'server');
    span.setTag(opentracing.Tags.HTTP_URL, url);

    // include trace ID in headers so that we can debug slow requests we see in
    // the browser by looking up the trace ID found in response headers
    const tracingHeaders = {};
    tracer.inject(span, opentracing.FORMAT_TEXT_MAP, tracingHeaders);
    reply.headers(tracingHeaders);

    Object.assign(request, { span });
    done();
  });

  fastify.addHook('onSend', async (request, reply) => {
    const { url, span } = request;
    const { statusCode } = reply;

    if (!span)
      return;

    span.logEvent('response_finished');

    if (statusCode >= 500) {
      span.setTag(opentracing.Tags.SAMPLING_PRIORITY, 1);
      span.setTag(opentracing.Tags.ERROR, true);
    }

    span.setTag(opentracing.Tags.HTTP_STATUS_CODE, statusCode);
    span.setOperationName(url);
  });

  fastify.addHook('onResponse', async (request, reply) => {
    const { span } = request;

    if (!span)
      return;

    span.logEvent('response_closed');
    span.finish();
  });

  done();
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
