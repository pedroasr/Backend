import mariadb, { Connection } from 'mariadb';
import fs from 'fs';

export type MariaConfig = {
    host: string;
    port: number;
    root: string;
    user: string;
    password: string;
    database: string;
};
export function buildSQLDatabase({
    host,
    port,
    user,
    password,
    database
}: MariaConfig) {
    let pool: Connection;
    async function runQuery(query: string) {
        if (!pool) throw new Error('Database not initialized');
        return pool.query(query);
    }

    async function init(): Promise<void> {
        pool = await mariadb.createConnection({
            host,
            port,
            password,
            user
        });
        await pool.query(`USE ${database}`);
        const fillDB = fs.readFileSync('./src/database/fillDatabase.txt');
        const orderDB = fillDB.toString().split('\n');
        for (let i = 0; i < orderDB.length; i++)
            await pool.query(orderDB[i]);
    }

    async function close(): Promise<void> {
        if (!pool) return;
        await pool.end();
    }

    return {
        init,
        close,
        runQuery
    };
}

export type SQL_DB = ReturnType<typeof buildSQLDatabase>;
