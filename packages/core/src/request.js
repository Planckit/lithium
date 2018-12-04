import http  from 'http';
import https from 'https';


const protocols = { http, https };

/**
 * @module Service
 */

/**
 *
 * @param  {String} hostname IP Address
 * @param  {Number} port Http or Https port
 * @param  {String} path to request
 * @param  {Object} data to seleralize and send
 * @param  {String} [method='GET']
 * @param  {Object} [headers] Optional headers to describe the request and pass Authorization data
 * @param  {String} [protocol='http']
 * @return {Promise} Response parsed as Object if content-type is application/json.
 * Otherwise response content as raw string.
 */
export default (hostname, port, path, data, method = 'GET', headers, protocol = 'http') =>
    new Promise((resolve, reject) => {
        const options = { hostname, port, path, method };

        if(headers) { options.headers = headers; }

        if(data) {
            try {
                data = JSON.stringify(data);
                options.headers = options.headers || {};
                options.headers['Content-Type']   = 'application/json';
                options.headers['Content-Length'] = Buffer.byteLength(data);
            } catch (e) {/**/}
        }

        if(process.env != 'production' && process.env != 'prod') {
            options.rejectUnauthorized = false;
        }

        const req = protocols[protocol].request(options, (res) => {
            let data;


            res.setEncoding('binary');
            res.on('data', (chunk) => {
                if(res.headers && res.headers['content-type'] == 'application/json; charset=utf-8') {
                    data = data || '';
                    data += chunk;
                } else {
                    data = data || [];
                    data.push(Buffer.from(chunk, 'binary'));
                }
            });
            res.on('end', () => {
                const result = { res };
                if(res.headers && res.headers['content-type'] == 'application/json; charset=utf-8') {
                    try { data && (result.data = JSON.parse(data)); }
                    catch (e) { data && (result.data = data); }
                } else {
                    data && (result.data = Buffer.concat(data));
                }

                resolve(result);
            });
        });

        req.on('error', reject);
        data && req.write(data);
        req.end();
    }
);
