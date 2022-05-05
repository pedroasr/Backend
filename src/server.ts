import fastify, { FastifyInstance, FastifyReply } from 'fastify';
import { Server } from 'http';
import type { Logger } from 'pino';
import { MovieServices } from './database/movie-service';
import { buildMovieRoutes } from './routes/movie/movie-events';
import fastifyCors from '@fastify/cors';
import { AdminServices } from './database/admin-services';
import { buildAdminRoutes } from './routes/admin/admin-events';

export function buildServer(
    logger: Logger,
    movieServices: MovieServices,
    adminServices: AdminServices
): FastifyInstance {
    const server = fastify({ logger });
    server.register(fastifyCors, {
        origin: '*'
    });
    server.register(async function routes(server: FastifyInstance) {
        server.register(buildMovieRoutes(), { prefix: '/', movieServices });
        server.register(buildAdminRoutes(), {
            prefix: '/admin',
            adminServices
        });
        server.setNotFoundHandler(function (
            request,
            reply: FastifyReply<Server>
        ) {
            reply.code(404).send({
                statusCode: 404,
                error: 'Not Found',
                message: 'Resource not found'
            });
        });
    });

    return server;
}
