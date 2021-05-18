declare module 'clickhouse' {
  interface ClickHouseQuery {
    toPromise(): Promise<any[]>
  }

  export class ClickHouse {
    constructor(params)
    query(qs: string): ClickHouseQuery
  }
}
