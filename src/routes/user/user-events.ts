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
            const user = await userServices.signup({
                username,
                password
            });
            if (!user) reply.status(409).send('Fail to signup the user.');
            else reply.status(201).send();
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
            if (user[1]) reply.status(204).send(user[0]);
            else reply.status(409).send(user[0]);
        }

        fastify.post('/signup', { schema: signupSchema }, signupUser);
        fastify.post('/login', { schema: loginSchema }, loginUser);
        next();
    };
}
