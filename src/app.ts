import { container } from "@/inversify.config";
import { TYPES } from "@/types";
import { IApp } from "@/app.class";

const app = container.get<IApp>(TYPES.App).bootstrap();

export default app;
