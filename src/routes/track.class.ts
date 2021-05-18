import { URL } from "url";
import { v4 as uuidV4 } from "uuid";
import { inject, injectable } from "inversify";
import { FastifyPluginAsync, FastifySchema } from "fastify";

import { IRoute } from "@/routes/interface";
import { TrackService } from "@/services/track.class";

interface TrackQuery {
  id: string;
}

const schema: FastifySchema = {
  querystring: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' }
    }
  }
};

@injectable()
export class TrackRoute implements IRoute {
  @inject("TrackService")
  private trackService: TrackService;

  register(): FastifyPluginAsync {
    return async (fastify) => {
      fastify.post<{
        Querystring: TrackQuery
      }>('/track', { schema }, async (request, reply) => {
        const { span } = request;
        const { id: trackerId } = request.query;
        const { user_id: userId = uuidV4() } = request.cookies;

        const eventId = uuidV4();

        span.setTag('user.id', userId);
        span.setTag('event.id', eventId);
        span.setTag('tracker.id', trackerId);

        const tracked = await this.trackService.track({
          ip: request.ip,
          eventId: eventId,
          trackerId: trackerId,
          url: new URL(request.url, `${request.protocol}://${request.headers.host}`)
            .toString(),
          userAgent: request.headers['user-agent']
        });

        if (!tracked)
          return reply.code(404).send();

        return reply.code(204)
          .setCookie('user_id', userId)
          .send();
      });
    };
  }
}
