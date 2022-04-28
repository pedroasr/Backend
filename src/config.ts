import convict from 'convict';
import dotEnv from 'dotenv';

export type Config = {
    env: 'production' | 'development' | 'test';
    projectName: string;
    log: {
        level: string;
        enabled: boolean;
    };
    http: {
        host: string;
        port: number;
    };
    maria: {
        host: string;
        port: number;
        root: string;
        user: string;
        password: string;
        database: string;
    };
};

export function buildConfig(): Config {
    dotEnv.config();
    const config = convict<Config>({
        projectName: {
            doc: 'Fastify project',
            format: String,
            default: 'lavideotecadelvago.com',
            env: 'PROJECT_NAME'
        },
        env: {
            doc: 'The application environment.',
            format: ['production', 'development', 'test'],
            default: 'development',
            env: 'NODE_ENV'
        },
        log: {
            level: {
                doc: 'The log level (default info).',
                format: String,
                default: 'info',
                env: 'LOG_LEVEL'
            },
            enabled: {
                doc: 'enable log (default true).',
                format: Boolean,
                default: true,
                env: 'LOG_ENABLED'
            }
        },
        http: {
            host: {
                doc: 'The host ip address to bind the http server.',
                format: String,
                default: '127.0.0.1',
                env: 'HTTP_HOST'
            },
            port: {
                doc: 'The port to bind the http server.',
                format: 'port',
                default: 3099,
                env: 'HTTP_PORT'
            }
        },
        maria: {
            host: {
                doc: 'The host ip address to bind the MariaDB server.',
                format: String,
                default: '172.17.0.2',
                env: 'MARIA_HOST'
            },
            port: {
                doc: 'The port to bind the MariaDB server.',
                format: 'port',
                default: 3306,
                env: 'MARIA_PORT'
            },
            root: {
                doc: 'The root password to bind the MariaDB server.',
                format: String,
                default: 'proyecto_peliculas',
                env: 'MARIA_ROOT_PASSWD'
            },
            user: {
                doc: 'The user to bind the MariaDB server.',
                format: String,
                default: 'pedro',
                env: 'MARIA_USER_NAME'
            },
            password: {
                doc: 'The user password to bind the MariaDB server.',
                format: String,
                default: 'peliculas',
                env: 'MARIA_USER_PASSWD'
            },
            database: {
                doc: 'The database name to bind the MariaDB server.',
                format: String,
                default: 'peliculas',
                env: 'MARIA_DATABASE_NAME'
            }
        }
    });
    config.validate({ allowed: 'strict' });
    return config.getProperties();
}