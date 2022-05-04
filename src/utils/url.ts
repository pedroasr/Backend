import { FastifyRequest } from 'fastify';
import { Movie } from '../database/movie-service';

function removeEndSlash(path: string): string {
    if (path[path.length - 1] === '/') {
        return path.slice(0, -1);
    }
    return path;
}

export function getUrl(request: FastifyRequest, path: string | null): string {
    const { hostname, protocol } = request;
    return `${protocol}://${hostname}${path ? removeEndSlash(path) : ''}`;
}

function getPagedLink(request: FastifyRequest, page: number, gender?: string): string {
    const path = request.url.split('?')[0];
    if (!gender)
        return getUrl(request, `${path}?page=${page}`);
    else
        return getUrl(request, `${path}?gender=${gender}&page=${page}`);
}

export function getPrevLink(
    request: FastifyRequest<{ Querystring: { page: number, gender?: string } }>
): string | undefined {
    const { page, gender } = request.query;
    return page !== 1 ? getPagedLink(request, page - 1, gender) : undefined;
}

export function getNextLink(
    request: FastifyRequest<{ Querystring: { page: number, gender?: string } }>,
    results: Movie[]
): string | undefined {
    const { page, gender } = request.query;
    return results.length === 9 ? getPagedLink(request, page + 1, gender) : undefined;
}
