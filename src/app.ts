import { FastifyInstance } from 'fastify';
import { buildServer } from './server';
import { buildMovieServices } from './database/movie-service';
import { Logger } from 'pino';
import { SQL_DB } from './database/maria-db';
import { buildAdminServices } from './database/admin-services';

export async function buildApp(logger: Logger, sqlDB: SQL_DB) {
    const movieServices = buildMovieServices(sqlDB);
    const adminServices = buildAdminServices(sqlDB);
    const server = buildServer(logger, movieServices, adminServices);
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
