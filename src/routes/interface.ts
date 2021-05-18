import { FastifyPluginAsync } from "fastify";

export interface IRoute {
  register(): FastifyPluginAsync
}
