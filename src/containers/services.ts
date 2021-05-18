import { ContainerModule, interfaces } from "inversify";

import * as services from "../services";
import { bindByClassName } from "@/utils/bind-by-class-name";

export const serviceContainer = new ContainerModule((bind: interfaces.Bind) => {
  // Register all services under original names
  bindByClassName(bind, ...Object.values(services));
});
