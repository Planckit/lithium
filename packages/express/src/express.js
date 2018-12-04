import { readFileSync } from 'fs';
import { join         } from 'path';
import http             from 'http';
import express          from 'express';
import bodyParser       from 'body-parser';
import spdy             from 'spdy';
import request          from '@pi-lithium/core/request';
import Service          from '@pi-lithium/core/service';


/**
 * [description]
 * @param  {[type]} microservice [description]
 * @param  {[type]} key          [description]
 * @param  {[type]} cert         [description]
 * @return {[type]}              [description]
 */
const Express = function(microservice, { key, cert } = {}) {
    const { services, port, https } = microservice;
    const app          = express();
    const serviceCache = {};
    const withHttps = !!(key && cert && https);

    let httpServer;
    let httpsServer;


    microservice.start = (cb) => {
        httpServer = new http.Server(app);
        httpServer.listen(port, err => {
            if (err) { logger && logger.error(err); }
            logger && logger.info(`✅ Server is running on Port ${port}`);
        });

        if(!withHttps) { return; }

        httpsServer = spdy.createServer({
            key:  readFileSync(join(process.cwd(), key)) + '',
            cert: readFileSync(join(process.cwd(), cert)) + '',
        }, app);

        httpsServer.listen(https, err => {
            if (err) { logger && logger.error(err); }
            logger && logger.info(`✅ Server is running on Port ${https}`);
        });

        cb && cb({ httpServer, httpsServer });
    };

    // app.use((req, res, next) => {
    //     console.log(req.url);
    //     next();
    // });

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());


    app.post('/service', async(req, res) => {
        try {
            const { name, hostname, port, https } = req.body;
            const service = { name, hostname, port, https };

            microservice.setService(service);

            res.end();
        } catch (e) { res.status(401).send(); logger && logger.error(e); }
    });

    app.get('/health', (req, res) => {
        res.send(microservice.health());
    });

    app.post('/notify', (req, res) => {
        logger && logger.info('post: notify');
        const { service, event, data } = req.body;
        res.end();

        microservice.callListeners(event, data, service);
    });

    app.use((req, res, next) => {
        if (!withHttps || req.url == '/service' || req.url == '/health') { return next(); }
        req.secure ?
            next() :
            res.redirect(`https://` + req.headers.host.replace(port, https) + req.url);
    });


    this.send = ({ hostname, port }, path, data, method) =>
        request({ hostname, port }, path, data, method);


    app.send = this.send;
    microservice.app = app;
    microservice.getHttpServer = () => httpServer;
    microservice.getHttpsServer = () => httpsServer;

    // extend microservice.service proxy with request function
    microservice.services = new Proxy(services, {
        get: (target, name) => {
            name = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            if(serviceCache[name]) { return serviceCache[name]; }

            let serviceInstance;

            try { serviceInstance = serviceCache[name] = new Service({ ...target[name], name }); }
            catch (e) { serviceInstance = serviceCache[name] = new Service({ name }); }

            // update service instance if new Service available
            services.on('update', (service) =>
                service.name == name && serviceInstance.setService(service));


            return serviceInstance;
        },
    });

    return microservice;
};


export default (microservice, options) => new Express(microservice, options);
