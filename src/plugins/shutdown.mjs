import fp from 'fastify-plugin';

export default fp((fastify, options, done) => {
  const signals = ['SIGINT', 'SIGTERM'];
  const handlers = [() => new Promise((r) => fastify.close(r))];
  const { timeout = 10000 } = options;

  const timeoutError = new Error('Shutdown timeout reached. Exiting.');

  signals.forEach((signal) => {
    process.once(signal, async () => {
      // Invoke shutdown handlers sequentially with race timeout
      await Promise.race([
        handlers.reduce((promise, handler) => promise.then(handler),
            Promise.resolve()),
        new Promise((_, r) => setTimeout(() => r(timeoutError), timeout))
      ]);
    });
  });

  fastify.decorate('shutdown', (...handlers) => handlers.push(...handlers));

  done();
});
