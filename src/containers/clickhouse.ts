import { ClickHouse } from 'clickhouse';
import { ContainerModule, interfaces } from "inversify";

import { DB } from "@/types";

const { CLICKHOUSE } = process.env;

export const clickhouseContainer = new ContainerModule((bind: interfaces.Bind) => {
  // Provide simple clickhouse HTTP client for getting event statistics
  bind(DB.ClickHouse).toDynamicValue(() => {
    return new ClickHouse({
      format: 'json',
      url: CLICKHOUSE,
      raw: false
    });
  });
});
