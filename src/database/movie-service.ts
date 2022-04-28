import { SQL_DB } from './maria-db';

export type Movie = {
    id: number,
    name: string,
    image: string,
};

export type MovieFull = {
    id: number,
    name: string,
    image: string,
    description: string,
    gender: string,
    release_year: string,
    rate: string
};

export type MovieServices = {
    list(page: number, pageSize: number, order: 'alphadescent' | 'alphaascent' | 'new' | 'old' | 'default') : Promise<Movie[]>,
    getById(id: string) : Promise<MovieFull>,
    getByFilter(page: number, pageSize: number, order: 'alphadescent' | 'alphaascent' | 'new' | 'old' | 'default', gender: string) : Promise<Movie[]>
};

export function buildMovieServices(db: SQL_DB) : MovieServices{
    return{
        async list(page: number, pageSize: number, order: 'alphadescent' | 'alphaascent' | 'new' | 'old' | 'default') : Promise<Movie[]>{
            switch (order){
                case 'alphaascent':
                    const queryAsc = await db.runQuery(`SELECT id, name, image FROM movies ORDER BY name;`);
                    return queryAsc.slice((page-1)*pageSize,page*pageSize);
                case 'alphadescent':
                    const queryDesc = await db.runQuery(`SELECT id, name, image FROM movies ORDER BY name DESC;`);
                    return queryDesc.slice((page-1)*pageSize,page*pageSize);
                case 'new':
                    const queryNew = await db.runQuery(`SELECT id, name, image FROM movies ORDER BY release_year DESC;`);
                    return queryNew.slice((page-1)*pageSize,page*pageSize);
                case 'old':
                    const queryOld = await db.runQuery(`SELECT id, name, image FROM movies ORDER BY release_year;`);
                    return queryOld.slice((page-1)*pageSize,page*pageSize);
                case 'default':
                    const queryDef = await db.runQuery(`SELECT id, name, image FROM movies;`);
                    return queryDef.slice((page-1)*pageSize,page*pageSize);
            }
        },
    
        async getById(id: string) : Promise<MovieFull>{
            return await db.runQuery(
                `SELECT * FROM movies WHERE id = ${id};`
            );
        },

        async getByFilter(page: number, pageSize: number, order: 'alphadescent' | 'alphaascent' | 'new' | 'old' | 'default', gender: string) : Promise<Movie[]>{
            switch (order){
                case 'alphaascent':
                    const queryAsc = await db.runQuery(`SELECT id, name, image FROM movies WHERE gender = '${gender}' ORDER BY name;`);
                    return queryAsc.slice((page-1)*pageSize,page*pageSize);
                case 'alphadescent':
                    const queryDesc = await db.runQuery(`SELECT id, name, image FROM movies WHERE gender = '${gender}' ORDER BY name DESC;`);
                    return queryDesc.slice((page-1)*pageSize,page*pageSize);
                case 'new':
                    const queryNew = await db.runQuery(`SELECT id, name, image FROM movies WHERE gender = ${gender}' ORDER BY release_year DESC;`);
                    return queryNew.slice((page-1)*pageSize,page*pageSize);
                case 'old':
                    const queryOld = await db.runQuery(`SELECT id, name, image FROM movies WHERE gender = '${gender}' ORDER BY release_year;`);
                    return queryOld.slice((page-1)*pageSize,page*pageSize);
                case 'default':
                    const queryDef = await db.runQuery(`SELECT id, name, image FROM movies WHERE gender = '${gender}';`);
                    return queryDef.slice((page-1)*pageSize,page*pageSize);
            }
        }
    }
} 