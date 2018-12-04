import request from './request';

/**
 * @module Service
 */

/**
 * @class
 * Lazy create a Serrvice Instance.
 * Every prop of the serviceDescriptor will be wrapped by the service instance.
 * @param {Object} serviceDescriptor
 * Description Object of a Service. Could be contain any property.
 * The Properties name, hostname and port are required.
 * @param {String} serviceDescriptor.name
 * @param {String} serviceDescriptor.hostname IP Address ot this Service
 * @param {Number} serviceDescriptor.port Http port of this Service
 */
const Service = function(serviceDescriptor) {
    let notifyQueue = [];
    let service = serviceDescriptor;


    for (let key in serviceDescriptor)
    { this[key] = serviceDescriptor[key]; }

    /**
     * @method get
     * @memberof module:Service~Service
     * @instance
     * @param {String} path to make a request to this Service instance
     * @param {Object} data to seleralize and send
     * @param {Object} [headers] Optional headers to describe the request and pass Authorization data
     */

     /**
      * @method post
      * @memberof module:Service~Service
      * @instance
      * @param {String} path
      * @param {Object} data
      * @param {Object} [headers]
      * @desc See asdasd {@link service.get}
      */

    /**
     * @method patch
     * @memberof module:Service~Service
     * @instance
     * @param {String} path
     * @param {Object} data
     * @param {Object} [headers]
     * @desc See asdasd {@link service.get}
     */

    /**
     * @method put
     * @memberof module:Service~Service
     * @instance
     * @param {String} path
     * @param {Object} data
     * @param {Object} [headers]
     * @desc See asdasd {@link service.get}
     */

    /**
     * @method delete
     * @memberof module:Service~Service
     * @instance
     * @param {String} path
     * @param {Object} data
     * @param {Object} [headers]
     * @desc See asdasd {@link service.get}
     */


    ['get', 'post', 'patch', 'put', 'delete'].forEach(method =>
        this[method] = (path, data, headers) => handleRequest(path, data, method, headers));

    /**
     * Change service endpoint for rest calls.
     * Every prop of the serviceDescriptor will be wrapped by the service instance.
     * @param {Object} serviceDescriptor
     * Description Object of a Service. Could be contain any property.
     * The Properties name, hostname and port are required.
     * @param {String} serviceDescriptor.name
     * @param {String} serviceDescriptor.hostname IP Address ot this Service
     * @param {Number} serviceDescriptor.port Http port of this Service.
     */
    this.setService = (serviceDescriptor) => {
        service = serviceDescriptor;

        for (let key in serviceDescriptor)
        { this[key] = serviceDescriptor[key]; }

        // retry failed requests and clear queue
        const notifyQueueCpy = [...notifyQueue];
        for (let requestObj of notifyQueueCpy) {
            const index = notifyQueue.indexOf(requestObj);

            ~index && notifyQueue.splice(index, 1);
            requestObj.cb(service);
        }
    };


    function handleRequest(path, data, method, headers) {
        const options = {
            hostname: service && service.hostname,
            port:     service && service.port,
            path,
            data,
            method,
            headers,
        };

        return new Promise((resolve, reject) =>
            service && (service.port || service.https) && service.hostname ?
                requestWrapper(resolve, reject, options) :
                queueRequest(resolve, reject, options));
    }

    function queueRequest(resolve, reject, options) {
        const { hostname, port, path, method, data, name } = options;
        let serializedData = typeof data == 'string' ? data : JSON.stringify(data);

        const exist = notifyQueue.find(e =>
           (e.name     == name     &&
           !e.hostname             &&
           !e.port)                ||
           (e.hostname == hostname &&
            e.port     == port     &&
            e.path     == path     &&
            e.method   == method   &&
            e.data     == serializedData)
        );

        !exist && notifyQueue.push({
            cb: async(service) => {
                const { name, hostname, port } = service;
                requestWrapper(resolve, reject, { ...options, name, hostname, port });
            },
            name,
            hostname,
            port,
            path,
            data: serializedData,
            method,
        });
    }

    async function requestWrapper(resolve, reject, options) {
        const { hostname, port, path, data, method, headers } = options;

        try {
            resolve(await request(hostname, port, path, data, method, headers));
        } catch (e) {
            e.code && e.code == 'ECONNREFUSED' &&
                queueRequest(resolve, reject, options);
        }
    }
};


export default Service;
