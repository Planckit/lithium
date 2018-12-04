import HealthCheck  from './healthCheck';
import Loadbalancer from '@pi-lithium/core/loadbalancer';
import EventListener from '@pi-lithium/core/eventlistener';


/**
 * [description]
 * @param  {[type]} server              [description]
 * @param  {Number} [pingInterval=1000] [description]
 * @return {[type]}                     [description]
 */
const Registry = function(server, pingInterval = 1000) {
    const eventListener = new EventListener();
    const registry = {
        services: {},
        routes: [],
        on: eventListener.on,
        requestQueue: {},
    };
    const loadbalancer = new Loadbalancer(registry);
    const healthCheck  = new HealthCheck(registry, server, pingInterval);


    this.on = eventListener.on;

    this.setService = async({ name, hostname, port, https, request }) => {
        const service = {
            name,
            hostname,
            port,
            health: 100,
        };

        https && (service.https = https);


        // Add Service to Registry if not exist or reset health
        registry.services[name] = registry.services[name] || [];

        const exist = registry.services[name].find(service =>
            equal(service, { hostname, port }));

        exist ?
            exist.health = 100 :
            registry.services[name].push(service);


        eventListener.callListeners('setService', service);

        // Return requested Services
        if(request) {
            const services = [];

            for (let name of request) {
                try {
                    const requestedService = loadbalancer.getService(name);
                    services.push(requestedService);

                    addToRoute(service, requestedService);
                } catch (e) {
                    addToRequestQueue(name, { hostname, port });
                }
            }

            return services.length && services;
        }
    };

    this.getService = ({ servicename, name, hostname, port }) => {
        eventListener.callListeners('getService', { servicename, hostname, port });

        try {
            const service = loadbalancer.getService(servicename);

            addToRoute({ name, hostname, port }, service);

            return service;
        } catch (e) {
            addToRequestQueue(servicename, {hostname, port});
        }
    };

    this.getRoutes = service =>
        registry.routes.reduce((p, c) => c.to.name == service.name ? [...p, c.from] : p, []);

    this.timeout = async service => {
        eventListener.callListeners('timeout', service);

        try { return loadbalancer.getService(service.name); }
        catch (e) {/**/}
    };

    this.on('setService', ({ name }) => {
        // Notify waiting services for updates
        if(registry.requestQueue[name] && registry.requestQueue[name].length) {
            try {
                const service = loadbalancer.getService(name);

                const queuedServices = [...registry.requestQueue[name]];
                queuedServices.forEach(async requesterService => {
                    try {
                        await server.send(requesterService, '/service', service, 'post');

                        removeFromRequestQueue(name, requesterService);

                        // Store Routes if service goes down (low health)
                        addToRoute(requesterService, service);
                    } catch (e) {
                        // requestQueue Service timed out -> Downrate health
                        eventListener.callListeners('timeout', requesterService);
                    }
                });
            } catch (e) {/**/}
        }
    });


    healthCheck.on('updateHealth', service => {
        if(service.health > 0) { return; }

        const routesToUpdate = registry.routes.filter(route =>
            equal(route.to, service));

        const routesToRemove = registry.routes.filter(route =>
            equal(route.from, service));

        const requestToRemove = [];
        for (let name in registry.requestQueue) {
            registry.requestQueue[name]
                .filter(request =>
                    equal(request, service))
                .forEach(request =>
                    requestToRemove.push({ name, request }));
        }

        if(routesToUpdate && routesToUpdate.length) {
            try {
                const newService = loadbalancer.getService(service.name);

                // Update Routes if healthy instance available
                routesToUpdate.forEach(async route => {
                    try {
                        await server.send(route.from, '/service', newService, 'post');

                        route.to = newService;
                    } catch (e) {
                        // registry.requestQueue Service timed out -> Downrate health
                        eventListener.callListeners('timeout', route.from);
                    }
                });
            } catch (e) {
                // Remove Route if no new instance is available and
                // add Service to requestQueue
                routesToUpdate.forEach(async route => {
                    const service  = route.from;
                    const { name } = route.to;

                    removeFromRoute(route);

                    addToRequestQueue(name, service);
                });
            }
        }

        if(routesToRemove && routesToRemove.length) {
            routesToRemove.forEach(async route => {
                removeFromRoute(route);
            });
        }

        if(requestToRemove && requestToRemove.length) {
            requestToRemove.forEach(async entry => {
                removeFromRequestQueue(entry.name, entry.request);
            });
        }
    });

    setInterval(() => {
        console.log('');
        console.log(JSON.stringify(registry, null, 4));
    }, 1000);

    function addToRoute(from, to) {
        const exist = registry.routes.find(route =>
            equal(route.from, from) &&
            equal(route.to, to));
        !exist && registry.routes.push({ from, to });
    }

    function addToRequestQueue(name, service) {
        if(registry.requestQueue[name]) {
            const exist = registry.requestQueue[name].find(request =>
                equal(request, service));

            if(exist) { return; }
        } else { registry.requestQueue[name] = registry.requestQueue[name] || []; }

        registry.requestQueue[name].push(service);
    }

    function removeFromRoute(route) {
        const index = registry.routes.indexOf(route);

        ~index && registry.routes.splice(index, 1);
    }

    function removeFromRequestQueue(name, service) {
        const index = registry.requestQueue[name].indexOf(service);
        registry.requestQueue[name].splice(index, 1);
    }

    function equal(serviceA, serviceB) {
        return serviceA.hostname == serviceB.hostname &&
               serviceA.port     == serviceB.port;
    }
};


export default Registry;
