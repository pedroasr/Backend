import { FastifyInstance, FastifyPluginCallback, FastifyRequest } from "fastify";
import { getNextLink, getPrevLink } from "../../utils/url";
import { MovieServices } from "../../database/movie-service";

const movieSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        image: { type: 'string' }
    }
};

const movieFullSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        image: { type: 'string' },
        description: { type: 'string' },
        gender: { type: 'string' },
        release_year: { type: 'integer' },
        rate: { type: 'number' }
    }
};

const listSchema = {
    tags: ['movies'],
    querystring: {
        page: { type: 'integer', minimum: 1, default: 1 },
        pageSize: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
        order: { type: 'string', default: 'default' }
    },
    response: {
        200: {
            properties: {
                results: {
                    items: movieSchema
                },
                next: { type: 'string' },
                prev: { type: 'string' }
            }
        }
    }
};

const idMovieSchema = {
    tags: ['movie'],
    querystring: {
        type : 'object',
        properties : {
            id: { type: 'string' }
        }
    },
    response: {
        200: { 
            type: 'object',
            properties: { 
                results: {
                    items: movieFullSchema
                }
            } 
        }
    }
} 

const filterMovieSchema = {
    tags: ['movies'],
    querystring: {
        page: { type: 'integer', minimum: 1, default: 1 },
        pageSize: { type: 'integer', minimum: 1, maximum: 100, default: 9 },
        order: { type: 'string', default: 'default' },
        gender: { type: 'string' }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                results: {
                    type: 'array',
                    item: movieSchema
                },
                next: { type: 'string' },
                prev: { type: 'string' },
            }
        }
    }
}; 

export function buildMovieRoutes() : FastifyPluginCallback<{movieServices : MovieServices}>{

    return function(fastify: FastifyInstance, opts, next){
        const { movieServices } = opts;

        async function listMovies(request : FastifyRequest<{Querystring: {page:number, pageSize:number, order: 'alphadescent' | 'alphaascent' | 'new' | 'old' | 'default'}}>){
            const { page, pageSize, order } = request.query;
            const movieList = await movieServices.list(page, pageSize, order);
            return {
                results: movieList,
                next: getNextLink(request, movieList),
                prev: getPrevLink(request)
            };
        }
 
        async function getMovieById(request : FastifyRequest<{Querystring: { id: string } }>){
            const { id } = request.query;
            const movie = await movieServices.getById(id);
            return {results: movie};
        }

        async function getByFilter(request : FastifyRequest<{Querystring: {page:number, pageSize:number, order: 'alphadescent' | 'alphaascent' | 'new' | 'old' | 'default', gender : string}}>) {
            const { page, pageSize, order, gender } = request.query; 
            const movieList = await movieServices.getByFilter(page, pageSize, order, gender);
            return {
                results: movieList,
                next: getNextLink(request, movieList),
                prev: getPrevLink(request)
            };
        }

        fastify.get('/', {schema: listSchema}, listMovies);
        fastify.get('/movie:id', {schema: idMovieSchema}, getMovieById);
        fastify.get('/filter:gender', {schema: filterMovieSchema}, getByFilter); 
        next();
    };
}
