
/**
 * Wrap middlewares to utilitiy object that accept global and local options
 *
 * import middlewares, { authorisation } from './middleware'
 * routes(middlewares({ globalOptions }))
 *
 * app.use(...middlewares)
 * app.use(middlewares.authorisation)
 * app.use(autorisation({ localOptions }), ...)
 *
 * @param  {[type]} middlewares [description]
 * @return {[type]}             [description]
 */
export const withOptions = (middlewares) => {
    // Add Global options to all middlewares and return a fn
    // that checks if used by express or like options constructor
    const middlewareFactory = (middleware, globalOptions = {}) =>
        (req, res, next, options = req) =>
            res ? // if res then direct express call otherwise only options are set
                middleware(req, res, next, globalOptions) :
                (req, res, next) =>
                    middleware(req, res, next, { ...globalOptions, ...options });

    // Wrap all middlewares with option constructor and return as iterable object
    const middlewareWithOptions = (options) => {
        const a = Object.entries(middlewares).reduce((p, c) => {
            p[c[0]] = middlewareFactory(c[1], options);
            return p;
        }, {});
        return addIterableToFn(a, a);
    };

    // Add ability to spread like an Array
    addIterableToFn(middlewareWithOptions, Object.values(middlewares).map(m => m => middlewareFactory(m)));


    // Add middleware as properties to spred like an object
    addPropertiesToFn(middlewareWithOptions, Object.entries(middlewares).reduce((p, c) => {
         p[c[0]] = middlewareFactory(c[1]);
         return p;
    }, {}));


    function addIterableToFn(fn, iterables) {
        fn[Symbol.iterator] = function* () {
            for (let key in iterables) { yield iterables[key]; }
        };

        fn[Symbol.isConcatSpreadable] = true;

        return fn;
    }

    function addPropertiesToFn(fn, props) {
        for (let key in props) { fn[key] = props[key]; }
    }

    return middlewareWithOptions;
};
