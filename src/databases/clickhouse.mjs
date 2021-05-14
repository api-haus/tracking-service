import { ClickHouse } from 'clickhouse';

const { CLICKHOUSE } = process.env;

export default new ClickHouse({
  url: CLICKHOUSE,
  format: 'json',
  raw: false
});
