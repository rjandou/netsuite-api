# Netsuite-API

The NetSuite API Node.js library facilitates seamless interaction with the NetSuite SuiteTalk Web Services, offering a structured way to make API calls for retrieving or sending data. Leveraging the OAuth 1.0a authentication method, it ensures secure communication between your Node.js application and the NetSuite platform. This library abstracts the intricacies of handling OAuth signatures and HTTP methods, providing a cleaner and more streamlined way to interact with NetSuite's API endpoints.

## Installation

Install the package by running the following command:

```
npm install netsuite-api --save
```

Include and configure the library in your project. It is recommended to set up an environment file to securely store your sensitive data such as API keys and secrets. You can use the `dotenv` package to help with this.

```javascript
const NetsuiteAPI = require('netsuite-api');

const config = {
  ACCOUNT_ID: 'your_account_id',
  CONSUMER_KEY: 'your_consumer_key',
  CONSUMER_SECRET: 'your_consumer_secret',
  TOKEN_ID: 'your_token_id',
  TOKEN_SECRET: 'your_token_secret'
};
```

## Usage

Create an instance of the NetSuiteAPI class, passing the configuration object with necessary credentials:

```javascript
const netSuiteAPI = new NetSuiteAPI(config);
```

### Making POST Requests
Use the post method to create a (custom) record:

```javascript
const postRequest = await client.post({
    url: 'https://ACCOUNT_ID.suitetalk.api.netsuite.com/services/rest/record/v1/YOUR_RECORD_TYPE',
    data: {
        name: "Record created via NetSuite-API"
    }
});
```

### Making GET Requests
Use the get method to read a (custom) record:

```javascript
const getRequest = await client.get({
    url: 'https://ACCOUNT_ID.suitetalk.api.netsuite.com/services/rest/record/v1/YOUR_RECORD_TYPE/INTERNAL_ID'
});
```

### Making PATCH Requests
Use the patch method to update a (custom) record:

```javascript
const patchRequest = await client.patch({
    url: 'https://ACCOUNT_ID.suitetalk.api.netsuite.com/services/rest/record/v1/YOUR_RECORD_TYPE',
    data: {
        name: "Record updated via NetSuite-API"
    }
});
```

### Making DELETE Requests
Use the delete method to delete a (custom) record:

```javascript
const deleteRequest = await client.delete({
    url: 'https://ACCOUNT_ID.suitetalk.api.netsuite.com/services/rest/record/v1/YOUR_RECORD_TYPE/INTERNAL_ID'
});
```

## To-Do

The following is a list of features and improvements planned for an upcoming releases:

- [ ] Retry logic

## Contributing

Feel free to contribute to the development of this library by submitting issues or pull requests.

## License

This project is licensed under the terms of the MIT license. Please check the LICENSE file for more information.