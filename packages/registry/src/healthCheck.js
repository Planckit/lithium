import EventListener from '@pi-lithium/core/eventlistener';


/**
 * [description]
 * @param  {[type]} registry     [description]
 * @param  {[type]} server       [description]
 * @param  {[type]} pingInterval [description]
 * @return {[type]}              [description]
 */
const HealthCheck = function(registry, server, pingInterval) {
    const eventListener = new EventListener();


    /**
     * [on description]
     * @type {[type]}
     */
    this.on = eventListener.on;


    async function getHealthUpdate(service) {
        if(service.health <= 0) { return; } // Ping only healthy services

        try {
            await server.send({
                hostname: service.hostname,
                port: service.port,
            }, '/health');

            service.health <= 80 ?
                service.health += 20 :
                service.health = 100;
        } catch (e) {
            if(service.health <= 0) { return; }
            service.health > 0 &&
                (service.health -= 50);
        }

        eventListener.callListeners('updateHealth', service);
    }

    registry.on('timeout', (targetService) => {
        const service = registry.services[name].find(service =>
            service.hostname == targetService.hostname &&
            service.port     == targetService.port);

        service && service.health > 0 &&
            (service.health -= 50);

        eventListener.callListeners('updateHealth', service);
    });

    setInterval(() => {
        for (let name in registry.services) {
            registry.services[name].forEach(service => getHealthUpdate(service));
        }
    }, pingInterval);
};


export default HealthCheck;
