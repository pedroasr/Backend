import { SQL_DB } from './maria-db';

export type PostMovie = {
    name: string;
    image: string;
    description: string;
    gender: string;
    release_year: string;
    rate: string;
};

export type AdminServices = {
    postMovie(movie: PostMovie): Promise<boolean>;
    //   updateMovie(user: User): Promise<[string, boolean]>;
    deleteMovie(movieId: number): Promise<boolean>;
};

export function buildMovieServices(db: SQL_DB): AdminServices {
    return {
        async postMovie(movie: PostMovie): Promise<boolean> {
            const queryPost = await db.runQuery(
                `INSERT INTO movies (name, image, description, gender, release_year, rate) VALUES (${movie.name}, ${movie.image}, ${movie.description}, ${movie.gender}, ${movie.release_year}, ${movie.rate});`
            );
            return queryPost ? true : false;
        },
        async deleteMovie(movieId: number): Promise<boolean> {
            const queryDelete = await db.runQuery(
                `DELETE * FROM movies WHERE id=${movieId};`
            );
            return queryDelete ? true : false;
        }
    };
}
