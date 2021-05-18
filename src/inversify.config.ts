import "reflect-metadata";
import { Container } from "inversify";

import { App } from "@/app.class";
import { TYPES } from "@/types";
import { Router } from "@/router.class";

import * as containers from '@/containers/index';

const container = new Container();

container.bind<App>(TYPES.App).to(App);
container.bind<Router>(TYPES.Router).to(Router);

container.load(
  ...Object.values(containers)
);

export { container };
