const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const { TOPIC_ARN } = process.env;

const snsPublish = async (message) => {
	const params = {
		Message: message /* required */,
		TopicArn: TOPIC_ARN,
	};
	console.log('snsPublish - params', params);
	try {
		const response = await sns.publish(params).promise();
		console.log('snsPublish - success - ', response);
		return response;
	} catch (err) {
		console.log('snsPublish - error - ', err);
		throw err;
	}
};

module.exports = {
    snsPublish,
}
