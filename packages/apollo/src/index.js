import { ApolloServer } from 'apollo-server-express';
import objectHash from 'object-hash';

import { getRemoteSchema } from './remote';


/**
 * [description]
 * @param  {[type]} microservice [description]
 * @param  {[type]} options      [description]
 * @return {[type]}              [description]
 */
const Apollo = function(microservice, options) {
    const { app } = microservice;
    const links = {};
    let isStated = false;
    let server;
    let createFn;
    let hash;
    let middlewareStack = {};

    microservice.notifyRoutes('api_changed');

    microservice.on('api_changed', async(data, service) => {
        links[service.name] && createServer(await createFn(this));

        microservice.notifyRoutes('api_changed');
    });

    /**
     * [create description]
     * @param {[Function]} fn
     */
    this.create = async(fn) => {
        createFn = fn;

        try { return createServer(await createFn(this)); }
        catch (e) { console.log(e); }
    };

    /**
     * [restart description]
     * @type {[type]}
     */
    this.restart = async() =>
        createServer(await createFn(this));

    /**
     * [getRemoteSchema description]
     * @type {[type]}
     */
    this.getRemoteSchema = async(service) => {
        links[service.name] = service;

        return getRemoteSchema(service);
    };

    app.use('/graphql', (req, res, next) => { res.set('Version', hash); next(); });


    function callMiddleware(stack, index, req, res, next) {
        stack[index] ? stack[index](req, res, () => callMiddleware(stack, index + 1, req, res, next)) : next();
    }

    function setMiddlewareStack() {
        app.use((req, res, next) => {
            middlewareStack[req.url] ? callMiddleware(middlewareStack[req.url], 0, req, res, next) : next();
        });
    }

    async function createServer(options) {
        if(server) { await server.stop(); }
        if(!isStated) { setMiddlewareStack(); isStated = true; }

        const { context: setContext } = options;

        // Set server defined context and extract possible token headers
        options.context = (requestObject) => {
            const { req } = requestObject;
            const previousContext = (setContext && setContext(requestObject)) || {};

            const { access, refresh } = (req.headers || {});
            const nextContext = {
                ...previousContext,
            };

            nextContext.token = nextContext.token || {};
            !nextContext.token.access && access && (nextContext.token.access = access);
            !nextContext.token.refresh && refresh && (nextContext.token.refresh = refresh);

            return nextContext;
        };

        hash = objectHash(options);
        middlewareStack = {};

        server = new ApolloServer(options);

        server.applyMiddleware({
            app: {
                use: (...args) => {
                    const [url, ...middleware] = args;

                    middlewareStack[url] = middlewareStack[url] || [];
                    middleware.forEach(m => middlewareStack[url].push(m));
                },
            },
            cors: false,
        });
    }

    microservice.apollo = this;

    return microservice;
};

/**
 * [getRemoteSchema description]
 * @param {[ASD]} asd
 */
Apollo.getRemoteSchema = getRemoteSchema;


export default (microservice, options) => new Apollo(microservice, options);
export { getRemoteSchema };
