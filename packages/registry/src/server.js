import http       from 'http';
import express    from 'express';
import bodyParser from 'body-parser';
import EventListener from '@pi-lithium/core/eventlistener';
import request from '@pi-lithium/core/request';


/**
 * [description]
 * @param  {Integer} PORT [description]
 * @return {[type]}      [description]
 */
const Server = function(PORT) {
    const app    = express();
    const server = new http.Server(app);
    const id     = Date.now();
    const eventListener = new EventListener();


    this.send = ({ hostname, port }, path, data, method = 'GET') =>
        request( hostname, port, path, data, method);

    this.on = eventListener.on;


    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.get('/service', async(req, res) => {
        try {
            const {
                servicename,
                name,
                hostname,
                port,
            } = req.query;

            const result = await eventListener.callListeners('getService', {
                servicename,
                name,
                hostname,
                port,
            });

            result ? res.json(result) : res.send();
        } catch (e) { res.status(401).send(); logger && logger.error(e); }
    });

    app.post('/service', async(req, res) => {
        try {
            const {
                name,
                hostname,
                port,
                https,
                opts,
                request,
            } = req.body;

            const result = await eventListener.callListeners('setService', {
                name,
                hostname,
                port,
                https,
                opts,
                request,
            });

            result ? res.json(result) : res.send();
        } catch (e) { res.status(401).send(); logger && logger.error(e); }
    });

    app.get('/subscribe', async(req, res) => {
        res.send({ id });
    });

    app.post('/notify', async(req, res) => {
        const { service, event, data } = req.body;
        res.end();

        const result = await eventListener.callListeners('getRoutes', service);

        result.forEach(s => this.send(s, '/notify', { service, event, data }, 'post'));
    });

    // app.post('/timeout', async(req, res) => {
    //     res.send(await eventListener.callListeners('timeout', req.body));
    // });

    server.listen(PORT, (err) => {
        if (err) { logger && logger.error(err); }
        logger && logger.info(`✅ Server is running on Port ${PORT}`);
    });
};

export default Server;
