import { buildConfig } from './config';
import gracefulShutdown from './graceful-shutdown';
import 'make-promises-safe';
import { buildApp } from './app';
import { buildLogger } from './logger';
import { buildSQLDatabase } from './database/maria-db';

const config = buildConfig();
const logger = buildLogger(config.log);

async function main() {
    logger.info(`Starting ${config.projectName}`);
    const { http, maria } = config;
    const sqlDB = buildSQLDatabase(maria);
    await sqlDB.init();

    const app = await buildApp(logger, sqlDB);

    await app.getServer().listen(http.port, http.host);
    process.on('SIGTERM', gracefulShutdown(app, logger, sqlDB));
    process.on('SIGINT', gracefulShutdown(app, logger, sqlDB));
}

main().catch(error => {
    logger.error(
        `Error while starting up ${config.projectName}. ${error.message}`
    );
    process.exit(1);
});