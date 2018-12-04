import request from './request';
import Eventlistener from 'shared/Eventlistener';


const Microservice = function(service, serviceregistry, options = {}) {
    const registry = options.registry || { services: {} };
    const eventlistener = new Eventlistener();
    const { pingInterval = 1000 } = serviceregistry;

    let lastPing = 0;

    this.on   = eventlistener.on;
    this.once = eventlistener.once;
    this.callListeners = eventlistener.callListeners;

    registry.on   = eventlistener.on;
    registry.once = eventlistener.once;

    setTimeout(() => register(options), 1000);


    this.name     = service.name;
    this.port     = service.port;
    this.https    = service.https;
    this.hostname = service.hostname;

    this.service = service;

    this.request = request;

    this.services = new Proxy(registry, {
        get: (target, name) => {
            // TODO: do loadbalancing here if loadbalancer is in options!

            // convert camelcase to dash names (e.g. databaseMemory to database-memory)
            name = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            return target[name] || (registry.services[name] && registry.services[name][0]);
        },
    });


    this.health = () => {
        lastPing = Date.now();
        return { status: 'ok' };
    };

    this.setService = service => {
        Array.isArray(service) ?
            service.forEach(service => addService(service)) :
            addService(service);

        eventlistener.callListeners('update', service);

        function addService(service) {
            const { name } = service;
            registry.services[name] = registry.services[name] || [];
            registry.services[name].push(service);
        }
    };

    this.notifyRoutes = (event, data) =>
        request(serviceregistry.hostname, serviceregistry.port, '/notify', { service, event, data }, 'post');


    // Register to ServiceRegistry and set requested Sercice addresses
    async function register({ timeout = true, routes } = { timeout: true }) {
        try {
            const data = { ...service, request: routes };
            const response = await request(serviceregistry.hostname, serviceregistry.port, '/service', data, 'post');

            response.data && response.data.length && response.data.forEach(service => {
                const { name } = service;
                registry.services[name] = registry.services[name] || [];
                registry.services[name].push(service);

                eventlistener.callListeners('update', service);
            });
        } catch (e) { timeout && setTimeout(() => register({ timeout, routes }), 1000); }
    }

    setInterval(() => {
        lastPing && (Date.now() - pingInterval * 2) > lastPing &&
            register({ ...options, timeout: false });
    }, pingInterval * 2);
};

export default Microservice;
