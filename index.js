const axios = require('axios');
const crypto = require('crypto');
const OAuth = require('oauth-1.0a');

async function createHeaders({config, requestData}) {
    const {TOKEN_ID, TOKEN_SECRET, CONSUMER_KEY, CONSUMER_SECRET, ACCOUNT_ID} = config;

    const requiredConfigKeys = ['ACCOUNT_ID', 'CONSUMER_KEY', 'CONSUMER_SECRET', 'TOKEN_ID', 'TOKEN_SECRET'];

    for (const key of requiredConfigKeys) {
        if (!config[key]) {
            throw new Error(`${key} is missing in the config object`);
        }
    }

    const token = {
        key: TOKEN_ID,
        secret: TOKEN_SECRET
    };

    const oauth = OAuth({
        consumer: {
            key: CONSUMER_KEY,
            secret: CONSUMER_SECRET
        },
        signature_method: 'HMAC-SHA256',
        hash_function(base_string, key) {
            return crypto
                .createHmac('SHA256', key)
                .update(base_string)
                .digest('base64')
        },
    });

    let headers = oauth.toHeader(oauth.authorize(requestData, token));
    headers.Authorization += ',realm="' + ACCOUNT_ID + '"';
    headers.authorization = headers.Authorization;
    delete headers.Authorization;
    return headers;

}

async function post({config, url, method = 'POST', data}) {

    if (!config || !url || !data) {
        return `Missing required parameters: ${!config ? 'config, ' : ''}${!url ? 'url, ' : ''}${!data ? 'data' : ''}`;
    }
    return main({config, url, method, data})
}

async function get({config, url, method = 'GET'}) {

    if (!config || !url ) {
        return `Missing required parameters: ${!config ? 'config, ' : ''}${!url ? 'url, ' : ''}`;
    }
    return main({config, url, method})
}

async function main({config, url, method, ...rest}) {
    try {
        const headers = await createHeaders({config,
            requestData: {
                url: url,
                method: method
            }
        });

        const options = { url, method, headers, data: rest.data };
        let objResponse = {
            success: false,
            status: null,
            statusText: null,
            data: null,
            location: null,
        };

        const response = await axios(options);
       
        if (method === 'POST') {
            if (response.status !== 204) {
                console.error('Something went wrong during POST. HTTP status is not 204');
            } else {
                objResponse.success = true;
                delete objResponse.data; // No data is returned for POST
                objResponse.location = response.headers.location;
                objResponse.status = response.status;
                objResponse.statusText = response.statusText;
                objResponse.location = response.headers.location;
            }
        } else if (method === 'GET') {
            if (response.status !== 200) {
                console.error('Something went wrong during GET. HTTP status is not 200');
            } else {
                objResponse.success = true;
                objResponse.status = response.status;
                objResponse.statusText = response.statusText;
                objResponse.data = response.data;
                delete objResponse.location; // No location is returned for GET
            }
        }
        return objResponse;

    } catch (error) {
        let cause = error.response && error.response.status === 401 
            ? 'Unauthorized. Please check your token-based credentials' 
            : `Error fetching data: ${error.message}`;
        return cause;
    }
}

module.exports = {
    post,
    get
};