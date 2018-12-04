import Server   from './server';
import Registry from './registry';


global.logger = console;


export default config => {
    const { service } = config;
    const server   = new Server(service.port);
    const registry = new Registry(server, service.pingInterval);


    server.on('setService',  registry.setService);
    server.on('getService',  registry.getService);
    server.on('getRoutes',   registry.getRoutes);
    server.on('subscribe',   registry.subscribe);
    server.on('timeout',     registry.timeout);
};
