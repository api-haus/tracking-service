import { inject, injectable } from "inversify";
import fastify, { FastifyInstance } from "fastify";
import cookieParser from "fastify-cookie";
import metricsPlugin from "fastify-metrics";
import { promisify } from "util";
import * as Sentry from "@sentry/node";

import logger from "@/integrations/logger";
import { TYPES } from "@/types";
import { tracer } from "@/integrations/opentracing";
import { IRoute } from "@/routes/interface";
import tracingPlugin from "@/plugins/tracing";
import shutdownPlugin from "@/plugins/shutdown";

export interface IApp {
  bootstrap(): FastifyInstance
}

@injectable()
export class App {
  @inject(TYPES.Router)
  private routerPlugin: IRoute;

  bootstrap(): FastifyInstance {
    const app = fastify({ logger });

    // Register plugins
    app.register(tracingPlugin, {
      tracer,
      syntheticEndpoints: ['/', '/metrics']
    });
    app.register(cookieParser);
    app.register(metricsPlugin, { endpoint: '/metrics' });
    app.register(shutdownPlugin, {
      tracer
    })
      .after(() => app.shutdown(
        tracer.close && promisify(tracer.close.bind(tracer)),
        () => Sentry.close()
      ));

    const { routerPlugin } = this;
    app.register(routerPlugin.register());

    // Expose basic availability route
    app.get('/', async () => {
      return 'OK';
    });

    return app;
  }
}
