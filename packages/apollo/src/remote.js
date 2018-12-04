import { ApolloLink, concat } from 'apollo-link';
import { HttpLink           } from 'apollo-link-http';
import { introspectSchema   } from 'graphql-tools';


/**
 * [getRemoteSchema description]
 * @param  {[Service]} service [description]
 * @return {[type]}            [description]
 */
export const getRemoteSchema = service => {
    const customFetch = async(uri, { body, method, headers }) => {
        try {
            const query = JSON.parse(body);
            const { data } = await service[method.toLocaleLowerCase()](uri, query, headers);

            return { text: async() => data };
        } catch (e) { console.log(e); }
    };

    return new Promise(async(resolve, reject) => {
        try {
            const { link, schema } = await getSchema();

            resolve({ link, schema });
        } catch (e) {
            setTimeout(async() => {
                try {
                    const { link, schema } = await getSchema();

                    resolve({ link, schema });
                } catch (e) { console.log(e); }
            }, 1000);
        }
    });

    async function getSchema() {
        const link = concat(new ApolloLink((operation, forward) => {
            operation.setContext((context) => ({
                ...context,
                headers: context.graphqlContext && context.graphqlContext.token,
            }));
            return forward(operation);
        }), new HttpLink({ fetch: customFetch }));
        const schema = await introspectSchema(link);

        return { link, schema };
    }
};
