import { App } from './app';
import { buildConfig } from './config';
import { Logger } from 'pino';
import { SQL_DB } from './database/maria-db';

export default function gracefulShutdown(
    app: App,
    logger: Logger,
    maria : SQL_DB
): () => Promise<void> {
    const config = buildConfig();
    return async (): Promise<void> => {
        try {
            logger.info(`Shutting down ${config.projectName}.`);
            await app.close();
            await maria.close();
            logger.info('Shutdown complete. Exit now.');
            process.exit(0);
        } catch (error) {
            logger.error('error while shutting down.', error);
            process.exit(1);
        }
    };
}