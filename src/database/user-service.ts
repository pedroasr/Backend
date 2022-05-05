import { SQL_DB } from './maria-db';

export type User = {
    username: string;
    password: string;
};

export type UserInfo = {
    username: string;
    profileImg: string;
};

export type UserServices = {
    signup(user: User): Promise<boolean>;
    login(user: User): Promise<[string, boolean]>;
    userInfo(user: User): Promise<[UserInfo | string, boolean]>;
    opinion(
        userId: number,
        movieId: number,
        opinion: string
    ): Promise<[string, boolean]>;
    updateProfileImg(userId: number, image: string): Promise<[string, boolean]>;
};

export function buildUserServices(db: SQL_DB): UserServices {
    return {
        async signup(user: User): Promise<boolean> {
            // El sistema no esta pensado para que dos usuarios compartan username.
            // Será necesario arreglarlo en un futuro.
            const querySignup = await db.runQuery(
                `INSERT INTO users (username, password) VALUES ('${user.username}', '${user.password}');`
            );
            return querySignup ? true : false;
        },
        async login(user: User): Promise<[string, boolean]> {
            const queryLogin = await db.runQuery(
                `SELECT ISNULL(username, '') FROM users WHERE username=${user.username} AND password=${user.password};`
            );
            return queryLogin
                ? [`Bienvenido ${user.username}`, true]
                : ['El usuario y/o la contraseña no coinciden.', false];
        },
        async userInfo(user: User): Promise<[UserInfo | string, boolean]> {
            const queryUserInfo = await db.runQuery(
                `SELECT ISNULL(username, ''), profileImg FROM users WHERE username=${user.username};`
            );
            return queryUserInfo
                ? [queryUserInfo, true]
                : ['No se ha encontrado el usuario', false];
        },
        async opinion(
            userId: number,
            movieId: number,
            opinion: string
        ): Promise<[string, boolean]> {
            const queryOpinion = await db.runQuery(
                `INSERT INTO opinions (userID, movieID, opinion) VALUES (${userId}, ${movieId}, ${opinion};`
            );
            return [queryOpinion, true];
        },
        async updateProfileImg(
            userId: number,
            image: string
        ): Promise<[string, boolean]> {
            const queryImg = await db.runQuery(
                `INSERT INTO users (profileImg) VALUES (${image}) WHERE id=${userId};`
            );
            return [queryImg, true];
        }
    };
}
