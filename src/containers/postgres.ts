import { Client } from 'pg';
import { ContainerModule, interfaces } from "inversify";

import { DB } from "@/types";

export const postgresContainer = new ContainerModule((bind: interfaces.Bind) => {
  // Postgres Client is configured with standard environment variables
  bind(DB.PostgreSQL).toDynamicValue(async () => {
    const client = new Client();
    await client.connect();
    return client;
  });
});
