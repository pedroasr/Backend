import {
    FastifyInstance,
    FastifyPluginCallback,
    FastifyReply,
    FastifyRequest
} from 'fastify';
import { Server } from 'http';
import { AdminServices } from '../../database/admin-services';

const movieFullSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        image: { type: 'string' },
        description: { type: 'string' },
        gender: { type: 'string' },
        release_year: { type: 'number' },
        rate: { type: 'number' }
    }
};

const movieIdParam = {
    type: 'object',
    properties: {
        id: {
            type: 'string',
            description: 'movie identifier'
        }
    },
    errorMessage: 'movie id must be a valid ObjectId'
};

const deleteSchema = {
    tags: ['movie'],
    params: movieIdParam,
    response: {
        204: {
            type: 'object'
        }
    }
};

const createMovieSchemaBody = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        image: { type: 'string' },
        description: { type: 'string' },
        gender: { type: 'string' },
        release_year: { type: 'number' },
        rate: { type: 'number' }
    }
};

const createSchema = {
    tags: ['movie'],
    body: createMovieSchemaBody,
    response: {
        201: movieFullSchema
    }
};

export function buildAdminRoutes(): FastifyPluginCallback<{
    adminServices: AdminServices;
}> {
    return function (fastify: FastifyInstance, opts, next) {
        const { adminServices } = opts;

        async function postMovie(
            request: FastifyRequest<{
                Body: {
                    name: string;
                    image: string;
                    description: string;
                    gender: string;
                    release_year: number;
                    rate: number;
                };
            }>,
            reply: FastifyReply<Server>
        ) {
            const { name, image, description, gender, release_year, rate } =
                request.body;
            const moviePost = await adminServices.post({
                name,
                image,
                description,
                gender,
                release_year,
                rate
            });
            if (typeof moviePost === 'boolean')
                reply
                    .status(409)
                    .send('Fail to create the movie. Probably repeated name.');
            else reply.status(201).send(moviePost);
        }

        async function deleteMovie(
            request: FastifyRequest<{ Querystring: { id: string } }>,
            reply: FastifyReply<Server>
        ) {
            const { id } = request.query;
            const deleteMovie = await adminServices.delete(id);
            if (deleteMovie) reply.status(204).send();
            else reply.status(409).send('Error to delete the movie.');
        }

        fastify.post('/post', { schema: createSchema }, postMovie);
        fastify.delete('/movie:id', { schema: deleteSchema }, deleteMovie);
        next();
    };
}
