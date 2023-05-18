const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const s3ListObjects = async (params) => {
	console.log('s3ListObjects - params -', params);
	try {
		const response = await s3.listObjects(params).promise();
		console.log('s3ListObjects - success -', response);
		return response;
	} catch (err) {
		console.log('s3ListObjects - error -', err);
		throw err;
	}
};

const s3GetObject = async (params) => {
	console.log('s3GetObject - params -', params);
	try {
		const response = await s3.getObject(params).promise();
		console.log('s3GetObject - success -', response);
		return response;
	} catch (err) {
		console.log('s3GetObject - error -', err);
		throw err;
	}
};

const s3GetReadStream = async (params) => {
	console.log('s3GetReadStream - params -', params);
	try {
		const response = await s3.getObject(params).createReadStream();
		console.log('s3GetReadStream - success -', response);
		return response;
	} catch (err) {
		console.log('s3GetReadStream - error -', err);
		throw err;
	}
};

const s3GetSignedUrl = async (params) => {
	console.log('s3GetSignedUrl - params -', params);
	try {
		const response = await s3.putObject(params).promise();
		console.log('s3GetSignedUrl - success -', response);
		return response;
	} catch (err) {
		console.log('s3GetSignedUrl - error -', err);
		throw err;
	}
};

/***
const params = {
    Bucket: bucketName + path,
    Key: key,
    Body: buffer,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg',
    ACL:'public-read'
};
*/
const s3PutObject = async (params) => {
	console.log('s3PutObject - params -', params);
	try {
		const response = await s3.putObject(params).promise();
		console.log('s3PutObject - success -', response);
		return response;
	} catch (err) {
		console.log('s3PutObject - error -', err);
		throw err;
	}
};

const s3PutObjectAcl = async (params) => {
	console.log('s3PutObjectAcl - params -', params);
	try {
		const response = await s3.putObjectAcl(params).promise();
		console.log('s3PutObjectAcl - success -', response);
		return response;
	} catch (err) {
		console.log('s3PutObjectAcl - error -', err);
		throw err;
	}
};

module.exports = {
	s3ListObjects,
	s3GetObject,
	s3GetReadStream,
	s3GetSignedUrl,
	s3PutObject,
	s3PutObjectAcl,
};
