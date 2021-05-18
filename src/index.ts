import '@/integrations/sentry';
import '@/integrations/opentracing';
import app from '@/app';

const { PORT = 8080, HOST = '0.0.0.0' } = process.env;

app.listen(+PORT, HOST)
  .catch(error => {
    throw error;
  });
