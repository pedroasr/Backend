import { FastifyInstance } from 'fastify';
import { buildServer } from './server';
import { buildMovieServices } from './database/movie-service';
import { Logger } from 'pino';
import { SQL_DB } from './database/maria-db';


export async function buildApp(logger : Logger, sqlDB : SQL_DB) {

    const movieServices = buildMovieServices(sqlDB);
    const server = buildServer(logger, movieServices);
    return {
        async close(): Promise<void> {
            await server.close();
        },
        getServer(): FastifyInstance {
            return server;
        }
    };
}

export type App = Awaited<ReturnType<typeof buildApp>>;
