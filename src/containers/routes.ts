import { ContainerModule, interfaces } from "inversify";

import { TYPES } from "@/types";
import { IRoute } from "@/routes/interface";

import * as routes from '../routes';

export const routeContainer = new ContainerModule((bind: interfaces.Bind) => {
  // Register all routes under multiInject
  for (const route of Object.values(routes))
    bind<IRoute>(TYPES.Route).to(route as (new () => IRoute));
});
