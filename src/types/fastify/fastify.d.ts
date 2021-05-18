import { Span } from "opentracing";

declare module 'fastify' {
  export interface FastifyRequest {
    span: Span
  }

  export interface FastifyInstance {
    shutdown(...handlers: (() => PromiseLike<unknown>)[]): void
  }
}
