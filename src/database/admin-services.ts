//import { SQL_DB } from './maria-db';

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