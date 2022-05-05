import {
    FastifyInstance,
    FastifyPluginCallback,
    FastifyReply,
    FastifyRequest
} from 'fastify';
import { Server } from 'http';
import { AdminServices, PostMovie } from '../../database/admin-services';
import { getUrl } from '../../utils/url';

const movieFullSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        image: { type: 'string' },
        description: { type: 'string' },
        gender: { type: 'string' },
        release_year: { type: 'integer' },
        rate: { type: 'number' }
    }
};

const movieIdParam = {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'movie identifier',
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

const createUpdateRuleSchemaBody = {
    type: 'object',
    required: [ 'name', 'image', 'description', 'gender', 'release_year', 'rate' ],
    properties: {
        name: { type: 'string' },
        image: { type: 'string' },
        description: { type: 'string', errorMessage: 'should be a valid description' },
        gender: { type: 'string' },
        release_year: { type: 'number' },
        rate: { type: 'number' }
    }
};

const createSchema = {
    tags: ['movie'],
    body: createUpdateRuleSchemaBody,
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
                    movie: PostMovie 
                };
            }>, reply: FastifyReply<Server>
        ) {
            const moviePost = await adminServices.post(request.body.movie);
            if (typeof moviePost === 'boolean')
                reply.status(409).send('Fail to create the movie. Probably repeated name.');  
            else {
                reply.header('Movie', getUrl(request, `/movie/${moviePost.id}`));
                reply.status(201).send(moviePost);
            }
        }

        async function deleteMovie(
            request: FastifyRequest<{ Querystring: { id: string } }>, reply: FastifyReply<Server>
        ) {
            const { id } = request.query;
            await adminServices.delete(id);
            reply.status(204).send();
        }

        fastify.post('/post', { schema: createSchema }, postMovie);
        fastify.delete('/movie:id', { schema: deleteSchema }, deleteMovie);
        next();
    };
}
