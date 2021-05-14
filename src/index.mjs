import './integrations/sentry.mjs';
import './integrations/opentracing.mjs';
import app from './app.mjs';

const { PORT = 8080, HOST = '0.0.0.0' } = process.env;

await app.listen(+PORT, HOST);
