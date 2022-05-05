import { SQL_DB } from './maria-db';
import { MovieFull } from './movie-service';

export type PostMovie = {
    name: string;
    image: string;
    description: string;
    gender: string;
    release_year: string;
    rate: string;
};

export type AdminServices = {
    post(movie: PostMovie): Promise<MovieFull | boolean>;
    //   updateMovie(user: User): Promise<[string, boolean]>;
    delete(movieId: string): Promise<boolean>;
};

export function buildAdminServices(db: SQL_DB): AdminServices {
    return {
        async post(movie: PostMovie): Promise<MovieFull | boolean> {
            const queryPost = await db.runQuery(
                `INSERT INTO movies (name, image, description, gender, release_year, rate) VALUES (${movie.name}, ${movie.image}, ${movie.description}, ${movie.gender}, ${movie.release_year}, ${movie.rate});`
            );
            return queryPost ? queryPost.id : false;
        },
        async delete(movieId: string): Promise<boolean> {
            const queryDelete = await db.runQuery(
                `DELETE * FROM movies WHERE id=${movieId};`
            );
            return queryDelete ? true : false;
        }
    };
}
