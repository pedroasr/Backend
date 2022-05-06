import { SQL_DB } from './maria-db';

export type User = {
    username: string;
    password: string;
};

export type UserInfo = {
    username: string;
    profileImg: string;
};

export type UserF = {
    id: number;
    username: string;
}

export type UserServices = {
    signup(user: User): Promise<UserF>;
    login(user: User): Promise<UserF>;
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
        async signup(user: User): Promise<UserF> {
            // El sistema no esta pensado para que dos usuarios compartan username.
            // Será necesario arreglarlo en un futuro.
            await db.runQuery(
                `INSERT INTO users (username, password) VALUES ('${user.username}', '${user.password}');`
            );
            const queryGetId = await db.runQuery(
                `SELECT id FROM users WHERE username = '${user.username}';`
            );
            return { id: queryGetId, username: user.username };  
        },
        async login(user: User): Promise<UserF> {
            const queryLogin = await db.runQuery(
                `SELECT id FROM users WHERE username = '${user.username}' AND password = '${user.password}';`
            );
            return { id: queryLogin, username: user.username };
        },
        async userInfo(user: User): Promise<[UserInfo | string, boolean]> {
            const queryUserInfo = await db.runQuery(
                `SELECT username, profileImg FROM users WHERE username=${user.username};`
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
                `INSERT INTO opinions (userID, movieID, opinion) VALUES ('${userId}', '${movieId}', '${opinion}';`
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
