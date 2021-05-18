import { injectable, multiInject } from "inversify";
import { FastifyPluginAsync } from "fastify";

import { TYPES } from "@/types";
import { IRoute } from "@/routes/interface";

@injectable()
export class Router {
  private readonly routes: IRoute[];

  constructor(@multiInject(TYPES.Route) routes: IRoute[]) {
    this.routes = routes;
  }

  register(): FastifyPluginAsync {
    return async (fastify) => {
      for (const route of this.routes)
        fastify.register(route.register());
    };
  }
}
