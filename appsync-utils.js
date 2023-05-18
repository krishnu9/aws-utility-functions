require('cross-fetch/polyfill');

const appsync = require('aws-appsync');
const { config: awsConfig } = require('aws-sdk');
const { AUTH_TYPE } = require('aws-appsync-auth-link/lib/auth-link');

const { API_GRAPHAPI_GRAPHQLAPIENDPOINTOUTPUT: GRAPHQLAPIENDPOINTOUTPUT, REGION } = process.env;

const appSyncClient = new appsync.AWSAppSyncClient({
	url: GRAPHQLAPIENDPOINTOUTPUT,
	region: REGION,
	auth: {
		type: AUTH_TYPE.AWS_IAM,
		credentials: awsConfig.credentials,
	},
	disableOffline: true,
});

const appSyncQuery = async (query, variables) => {
	console.log('appSyncQuery - variables', variables);
	let response;
	try {
		response = await appSyncClient.query({ query, variables, fetchPolicy: 'network-only' });
	} catch (err) {
		console.log('appSyncQuery - error - ', err);
		return;
	}
	console.log('appSyncQuery - result - ', response);
	return response;
};

const appSyncMutation = async (mutation, variables) => {
	console.log('appSyncMutation - variables', variables);
	let response;
	try {
		response = await appSyncClient.mutate({ mutation, variables });
	} catch (err) {
		console.log('appSyncMutation - error - ', err);
		return;
	}
	console.log('appSyncMutation - result - ', response);
	return response;
};

module.exports = {
	appSyncClient,
	appSyncQuery,
	appSyncMutation,
};
