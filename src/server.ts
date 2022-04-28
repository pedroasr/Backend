import fastify, { FastifyInstance, FastifyReply } from 'fastify';
import { Server } from 'http';
import type { Logger } from 'pino';
import { MovieServices } from './database/movie-service';
import { buildMovieRoutes } from './routes/movie/movie-events';

export function buildServer(logger: Logger, movieServices : MovieServices): FastifyInstance {
    const server = fastify({ logger });
    server.register(async function routes(server: FastifyInstance) {

        server.register(buildMovieRoutes(), { prefix: 'movies', movieServices});
        server.setNotFoundHandler(function(request, reply: FastifyReply<Server>) {
			reply.code(404).send({
				statusCode: 404,
				error: 'Not Found',
				message: 'Resource not found'
			});
		});

    });

    return server;
}



