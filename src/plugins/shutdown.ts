import fp from 'fastify-plugin';

// Execute promises in series
const series = handlers => handlers
  .filter(v => typeof v === 'function')
  .reduce((promise, handler) => promise.then(handler), Promise.resolve());

// Throw error on timeout
const rejectOnTimeout = (timeout, err) => new Promise((_, reject) => {
  setTimeout(() => reject(err), timeout);
});

export default fp((fastify, options, done) => {
  const signals = ['SIGINT', 'SIGTERM'] as const;
  const handlers = [() => new Promise((r) => fastify.close(r))];
  const { timeout = 10000 } = options;

  const timeoutError = new Error('Shutdown timeout reached. Exiting.');

  // Shutdown on every signal
  for (const signal of signals)
    process.once(signal, async () => {
      // Invoke shutdown handlers sequentially with race timeout
      await Promise.race([
        series(handlers),
        rejectOnTimeout(timeout, timeoutError)
      ]);
    });

  // For additional shutdown handlers
  fastify.decorate('shutdown', (...handlers) => handlers.push(...handlers));

  done();
});
