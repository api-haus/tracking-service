import { inject, injectable } from "inversify";
import { FastifyPluginAsync, FastifySchema } from "fastify";

import { IRoute } from "@/routes/interface";
import { StatsService } from "@/services/stats.class";

interface StatsQuery {
  id: string;
  from: string;
  to: string;
}

const schema: FastifySchema = {
  querystring: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
      from: {
        type: 'string',
        oneOf: [{ format: 'date' }, { format: 'date-time' }]
      },
      to: {
        type: 'string',
        oneOf: [{ format: 'date' }, { format: 'date-time' }]
      }
    }
  }
};

@injectable()
export class StatsRoute implements IRoute {
  @inject("StatsService")
  private statsService: StatsService;

  register(): FastifyPluginAsync {
    return async (fastify) => {
      fastify.get<{
        Querystring: StatsQuery
      }>('/stats', { schema }, async (request) => {
        const { id: trackerId, from, to } = request.query;

        const { count } = await this.statsService.stats({
          trackerId,
          fromDate: from && new Date(from),
          toDate: to && new Date(to)
        });

        return { count };
      });
    };
  }
}
