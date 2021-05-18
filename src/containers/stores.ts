import { ContainerModule, interfaces } from "inversify";

import * as stores from "../store";
import { bindByClassName } from "@/utils/bind-by-class-name";

export const storesContainer = new ContainerModule((bind: interfaces.Bind) => {
  // Register all stores under original names
  bindByClassName(bind, ...Object.values(stores));
});
