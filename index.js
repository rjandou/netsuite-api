const axios = require('axios');
const crypto = require('crypto');
const OAuth = require('oauth-1.0a');

class NetSuiteAPI {
  constructor(config) {
    const requiredConfigKeys = ['ACCOUNT_ID', 'CONSUMER_KEY', 'CONSUMER_SECRET', 'TOKEN_ID', 'TOKEN_SECRET'];
    for (const key of requiredConfigKeys) {
      if (!config[key]) {
        throw new Error(`${key} is missing in the config object`);
      }
    }

    this.config = config;
    this.oauth = OAuth({
      consumer: {
        key: config.CONSUMER_KEY,
        secret: config.CONSUMER_SECRET
      },
      signature_method: 'HMAC-SHA256',
      hash_function(base_string, key) {
        return crypto
          .createHmac('SHA256', key)
          .update(base_string)
          .digest('base64');
      },
    });
  }

  async createHeaders(requestData) {
    const token = {
      key: this.config.TOKEN_ID,
      secret: this.config.TOKEN_SECRET
    };

    let headers = this.oauth.toHeader(this.oauth.authorize(requestData, token));
    headers.Authorization += `,realm="${this.config.ACCOUNT_ID}"`;
    headers.authorization = headers.Authorization;
    delete headers.Authorization;
    headers.Prefer = "transient";
    return headers;
  }

  async request({ url, method, data }) {
    try {
      const headers = await this.createHeaders({
        url: url,
        method: method
      });

      const options = { url, method, headers, data };
      const response = await axios(options);

      let objResponse = {
        success: false,
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        location: response.headers.location,
      };

      if (
        (method === 'POST' && (response.status === 204 || response.status === 200)) || 
        (method === 'GET' && response.status === 200) ||
        (method === 'PATCH' && response.status === 204) ||  
        (method === 'DELETE' && response.status === 204) ) { 
            objResponse.success = true;
      } else {
        console.error(`Something went wrong during ${method} with ${response.status}`);
      }

      return objResponse;

    } catch (error) {
      let cause = error.response && error.response.status === 401
        ? 'Unauthorized. Please check your token-based credentials'
        : `Error fetching data: ${error.message}`;
      return cause;
    }
  }

  async post({ url, data }) {
    if (!url || !data) {
      return `Missing required parameters: ${!url ? 'url, ' : ''}${!data ? 'data' : ''}`;
    }
    return this.request({ url, method: 'POST', data });
  }

  async get({ url }) {
    if (!url) {
      return 'Missing required parameter: url';
    }
    return this.request({ url, method: 'GET' });
  }

  async patch({ url, data }) {
    if (!url || !data) {
      return `Missing required parameters: ${!url ? 'url, ' : ''}${!data ? 'data' : ''}`;
    }
    return this.request({ url, method: 'PATCH', data });
  }

  async delete({ url }) {
    if (!url) {
      return 'Missing required parameter: url';
    }
    return this.request({ url, method: 'DELETE' });
  }
}

module.exports = NetSuiteAPI;
