const Loadbalancer = function(registry = { services: {} }) {
    this.getService = name => {
        if(!registry.services[name]) { throw new Error('No healthy istance available!!: ' + name); }

        const service = registry.services[name].reduce((a, v) =>
            a.health > v.health ? a : v);

        if(service.health == 0) { throw new Error('No healthy istance available!: ' + name); }

        return service;
    };

    this.getRegistry = () => registry;
};

export default Loadbalancer;
