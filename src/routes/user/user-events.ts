import {
    FastifyInstance,
    FastifyPluginCallback,
    FastifyReply,
    FastifyRequest
} from 'fastify';
import { Server } from 'http';
import { UserServices } from '../../database/user-service';

const userSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        username: { type: 'string' }
    }
};

const signupLoginUserSchemaBody = {
    type: 'object',
    properties: {
        username: { type: 'string' },
        password: { type: 'string' }
    }
};

const signupSchema = {
    tags: ['user'],
    body: signupLoginUserSchemaBody,
    response: {
        201: userSchema
    }
};

const loginSchema = {
    tags: ['user'],
    body: signupLoginUserSchemaBody,
    response: {
        200: userSchema
    }
};

export function buildUserRoutes(): FastifyPluginCallback<{
    userServices: UserServices;
}> {
    return function (fastify: FastifyInstance, opts, next) {
        const { userServices } = opts;

        async function signupUser(
            request: FastifyRequest<{
                Body: {
                    username: string;
                    password: string;
                };
            }>,
            reply: FastifyReply<Server>
        ) {
            const { username, password } = request.body;
            await userServices.signup({
                username,
                password
            });
            reply.status(201).send(`Usuario ${username} creado`);
        }

        async function loginUser(
            request: FastifyRequest<{
                Body: {
                    username: string;
                    password: string;
                };
            }>,
            reply: FastifyReply<Server>
        ) {
            const { username, password } = request.body;
            const user = await userServices.login({ username, password });
            reply.status(200).send(`Usuario ${user[1]} logeado.`);
        }

        fastify.post('/signup', { schema: signupSchema }, signupUser);
        fastify.post('/login', { schema: loginSchema }, loginUser);
        next();
    };
}
