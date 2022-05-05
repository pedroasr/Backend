import { SQL_DB } from './maria-db';

export type PostMovie = {
    name: string;
    image: string;
    description: string;
    gender: string;
    release_year: number;
    rate: number;
};

export type AdminServices = {
    post(movie: PostMovie): Promise<void | boolean>;
    delete(movieId: string): Promise<boolean>;
};

export function buildAdminServices(db: SQL_DB): AdminServices {
    return {
        async post(movie: PostMovie): Promise<void | boolean> {
            console.log(movie);
            const queryPost = await db.runQuery(
                `INSERT INTO movies (name, image, description, gender, release_year, rate) VALUES ('${movie.name}', '${movie.image}', '${movie.description}', '${movie.gender}', '${movie.release_year}', '${movie.rate}');`
            );
            if (!queryPost) return false;
        },
        async delete(movieId: string): Promise<boolean> {
            const queryDelete = await db.runQuery(
                `DELETE FROM movies WHERE id=${movieId};`
            );
            return queryDelete ? true : false;
        }
    };
}
