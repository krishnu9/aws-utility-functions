const { CognitoIdentityServiceProvider } = require('aws-sdk');
const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();

const { AUTH_REALTOR7583390075833900_USERPOOLID: UserPoolId } = process.env;

const findUser = async (key, value) => {
	const params = {
		UserPoolId,
		Filter: `${key} = "${value}"`,
		Limit: 1,
	};
	console.log('findUser - params - ', params);
	let response;
	try {
		response = await cognitoIdentityServiceProvider.listUsers(params).promise();
	} catch (err) {
		console.log('findUser - error - ', err);
	}
	console.log('findUser - success - ', response);
	return response?.Users?.pop();
};

const getUser = async (Username) => {
	const params = { UserPoolId, Username };
	console.log('getUser - params - ', params);
	try {
		const response = await cognitoIdentityServiceProvider.adminGetUser(params).promise();
		console.log('getUser - success - ', response);
		return response;
	} catch (err) {
		console.log('getUser - error - ', err);
	}
};

const getUserByToken = async (AccessToken) => {
	const params = { AccessToken };
	console.log('getUserByToken - params - ', params);
	try {
		const response = await cognitoIdentityServiceProvider.getUser(params).promise();
		console.log('getUserByToken - success - ', response);
		return response;
	} catch (err) {
		console.log('getUserByToken - error - ', err);
	}
};

const getUsersInGroup = async (UserPoolId, GroupName, Limit, NextToken) => {
	const params = {
		GroupName,
		UserPoolId,
		...(Limit && { Limit }),
		...(NextToken && { NextToken }),
	};
	console.log('listUsersInGroup - params - ', params);
	try {
		const result = await cognitoIdentityServiceProvider.listUsersInGroup(params).promise();
		return result;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

const getAllUsersInGroup = async (groupName) => {
	let users = [];
	let nextToken;
	while (true) {
		const response = await listUsersInGroup(groupName, 50, nextToken);
		nextToken = response.NextToken;
		users = [...users, ...response.Users];
		if (!nextToken) {
			break;
		}
	}
	return users;
};

const getUserAttributes = (user) => {
	console.log('getUserAttributes - user - ', user);
	const data = user.UserAttributes || user.Attributes || [];
	const attributes = {
		id: user.Username,
		isEnabled: user.Enabled,
		createdAt: user.UserLastModifiedDate,
		updatedAt: user.UserLastModifiedDate,
		status: user.UserStatus,
		username: user.Username,
		enabled: user.Enabled ? true : false,
		status: user.UserStatus,
		sub: data.find((attr) => attr.Name === 'sub')?.Value || '',
		address: data.find((attr) => attr.Name === 'address')?.Value || '',
		birthdate: data.find((attr) => attr.Name === 'birthdate')?.Value || '',
		email: data.find((attr) => attr.Name === 'email')?.Value || '',
		family_name: data.find((attr) => attr.Name === 'family_name')?.Value || '',
		gender: data.find((attr) => attr.Name === 'gender')?.Value || '',
		given_name: data.find((attr) => attr.Name === 'given_name')?.Value || '',
		locale: data.find((attr) => attr.Name === 'locale')?.Value || '',
		middle_name: data.find((attr) => attr.Name === 'middle_name')?.Value || '',
		name: data.find((attr) => attr.Name === 'name')?.Value || '',
		nickname: data.find((attr) => attr.Name === 'nickname')?.Value || '',
		phone_number: data.find((attr) => attr.Name === 'phone_number')?.Value || '',
		picture: data.find((attr) => attr.Name === 'picture')?.Value || '',
		preferred_username: data.find((attr) => attr.Name === 'preferred_username')?.Value || '',
		profile: data.find((attr) => attr.Name === 'profile')?.Value || '',
		updated_at: data.find((attr) => attr.Name === 'updated_at')?.Value || '',
		website: data.find((attr) => attr.Name === 'website')?.Value || '',
		zoneinfo: data.find((attr) => attr.Name === 'zoneinfo')?.Value || '',
		createdAt: data.UserCreateDate,
		updatedAt: data.UserLastModifiedDate,
		'custom:customer_id': data.find((attr) => attr.Name === 'custom:customer_id')?.Value || '',
		'custom:subscription_id': data.find((attr) => attr.Name === 'custom:subscription_id')?.Value || '',
		'custom:subscription_status': data.find((attr) => attr.Name === 'custom:subscription_status')?.Value || '',
		'custom:invoice_id': data.find((attr) => attr.Name === 'custom:invoice_id')?.Value || '',
		'custom:created_at': data.find((attr) => attr.Name === 'custom:created_at')?.Value || '',
		'custom:last_login_at': data.find((attr) => attr.Name === 'custom:last_login_at')?.Value || '',
		'custom:coupon_code': data.find((attr) => attr.Name === 'custom:coupon_code')?.Value || '',
	};
	console.log('getUserAttributes - result - ', attributes);
	return attributes;
};

const getUserAttribute = async (user, key, defaultValue = null, verbose = false) => {
	if (verbose) {
		console.log(`getUserAttribute - user=${JSON.stringify(user)}, key=${key}, defaultValue=${defaultValue}`);
	}
	let attributes = user['UserAttributes'] || user['Attributes'] || null;
	if (!attributes) {
		if (verbose) {
			console.log('getUserAttribute - attributes not found');
		}
		return defaultValue;
	}
	for (const value of attributes) {
		if ('Name' in value && value['Name'] === key) {
			if (verbose) {
				console.log(`getUserAttribute - value=${JSON.stringify(value)}`);
			}
			return value['Value'];
		}
	}
	if (verbose) {
		console.log('getUserAttribute - value not found');
	}
	return defaultValue;
};

const addUserToGroup = async (Username, GroupName) => {
	const params = { GroupName, UserPoolId, Username };
	console.log('addUserToGroup - params - ', params);
	try {
		const response = await cognitoIdentityServiceProvider.adminAddUserToGroup(params).promise();
		console.log('addUserToGroup - success - ', response);
		return response;
	} catch (err) {
		console.log('addUserToGroup - error - ', err);
		throw err;
	}
};

const removeUserFromGroup = async (Username, GroupName) => {
	const params = { GroupName, UserPoolId, Username };
	console.log('removeUserFromGroup - params - ', params);
	try {
		const response = await cognitoIdentityServiceProvider.adminRemoveUserFromGroup(params).promise();
		console.log('removeUserFromGroup - success - ', response);
		return response;
	} catch (err) {
		console.log('removeUserFromGroup - error - ', err);
		throw err;
	}
};

// Confirms as an admin without using a confirmation code.
const confirmUserSignUp = async (Username) => {
	const params = { UserPoolId, Username };
	try {
		const response = await cognitoIdentityServiceProvider.adminConfirmSignUp(params).promise();
		console.log('confirmUserSignUp - success - ', response);
		return response;
	} catch (err) {
		console.log('confirmUserSignUp - error - ', err);
		throw err;
	}
};

const disableUser = async (Username) => {
	const params = { UserPoolId, Username };
	console.log('disableUser - params -  ', params);
	try {
		const response = await cognitoIdentityServiceProvider.adminDisableUser(params).promise();
		console.log('disableUser - success - ', response);
		return response;
	} catch (err) {
		console.log('disableUser - error - ', err);
		throw err;
	}
};

const enableUser = async (Username) => {
	const params = { UserPoolId, Username };
	console.log('enableUser - params - ', params);
	try {
		const response = await cognitoIdentityServiceProvider.adminEnableUser(params).promise();
		console.log('enableUser - success - ', response);
		return response;
	} catch (err) {
		console.log('enableUser - error - ', err);
		throw err;
	}
};

const listUsers = async (Limit, PaginationToken) => {
	const params = {
		UserPoolId,
		...(Limit && { Limit }),
		...(PaginationToken && { PaginationToken }),
	};
	console.log('listUsers - params - ', params);
	try {
		const response = await cognitoIdentityServiceProvider.listUsers(params).promise();
		// Rename to NextToken for consistency with other Cognito APIs
		response.NextToken = response.PaginationToken;
		delete response.PaginationToken;
		return response;
	} catch (err) {
		console.log('listUsers - error - ', err);
		throw err;
	}
};

const listAllUsers = async (Limit = 50) => {
	let PaginationToken;
	let users = [];
	const params = {
		UserPoolId,
		...(Limit && { Limit }),
		...(PaginationToken && { PaginationToken }),
	};
	while (true) {
		try {
			console.log('listAllUsers - params', params);
			const response = await cognitoIdentityServiceProvider.listUsers(params).promise();
			users = [...users, ...response.Users];
			PaginationToken = response.PaginationToken;
			if (!PaginationToken) {
				break;
			}
			params.PaginationToken = PaginationToken;
		} catch (err) {
			console.log('listAllUsers - error - ', err);
			throw err;
		}
	}
	console.log('listAllUsers - success - found users', users.length);
	if (users.length > 0) {
		console.log('listAllUsers - success - sample', users[0]);
	}
	return users;
};

const listGroups = async (Limit, PaginationToken) => {
	const params = {
		UserPoolId,
		...(Limit && { Limit }),
		...(PaginationToken && { PaginationToken }),
	};
	console.log('listGroups - params -', params);
	try {
		const response = await cognitoIdentityServiceProvider.listGroups(params).promise();
		// Rename to NextToken for consistency with other Cognito APIs
		response.NextToken = response.PaginationToken;
		delete response.PaginationToken;
		return response;
	} catch (err) {
		console.log('listGroups - error -', err);
		throw err;
	}
};

const listGroupsForUser = async (Username, Limit, NextToken) => {
	const params = {
		UserPoolId,
		Username,
		...(Limit && { Limit }),
		...(NextToken && { NextToken }),
	};
	console.log('listGroupsForUser - params - ', params);
	try {
		const result = await cognitoIdentityServiceProvider.adminListGroupsForUser(params).promise();
		console.log('listGroupsForUser - success - ', result);
		/**
		 * We are filtering out the results that seem to be innapropriate for client applications
		 * to prevent any informaiton disclosure. Customers can modify if they have the need.
		 */
		result.Groups.forEach((val) => {
			delete val.UserPoolId, delete val.LastModifiedDate, delete val.CreationDate, delete val.Precedence, delete val.RoleArn;
		});
		return result;
	} catch (err) {
		console.log('listGroupsForUser - error -', err);
		throw err;
	}
};

const listUsersInGroup = async (GroupName, Limit, NextToken) => {
	const params = {
		GroupName,
		UserPoolId,
		...(Limit && { Limit }),
		...(NextToken && { NextToken }),
	};
	console.log('listUsersInGroup -  params - ', params);
	try {
		const response = await cognitoIdentityServiceProvider.listUsersInGroup(params).promise();
		return response;
	} catch (err) {
		console.log('listUsersInGroup - err - ', err);
	}
};

const createGroup = async (GroupName) => {
	const params = { GroupName, UserPoolId };
	let response;
	try {
		console.log('createGroup - fetch existing group - params - ', params);
		response = await cognitoIdentityServiceProvider.getGroup(params).promise();
	} catch (err) {
		console.log('createGroup - error', err);
		try {
			console.log('createGroup - create new group - params - ', params);
			response = await cognitoIdentityServiceProvider.createGroup({ ...params, Precedence: 2 }).promise();
		} catch (err) {
			console.log('createGroup error', err);
			throw err;
		}
	}
	console.log('createGroup - success - ', response);
	return response;
};

async function createUser(Username, UserAttributes) {
	const params = {
		UserPoolId,
		Username,
		UserAttributes,
		DesiredDeliveryMediums: ['EMAIL'],
	};
	console.log('createUser - params - ', params);
	try {
		const response = await cognitoIdentityServiceProvider.adminCreateUser(params).promise();
		console.log('createUser - success - ', response);
		return response;
	} catch (err) {
		console.log('createUser - error', err);
		throw err;
	}
}

const UpdateUser = async (Username, UserAttributes) => {
	const params = { UserPoolId, Username, UserAttributes };
	console.log('UpdateUser - params - ', params);
	try {
		const response = await cognitoIdentityServiceProvider.adminUpdateUserAttributes(params).promise();
		console.log('UpdateUser - success - ', response);
	} catch (err) {
		console.log('UpdateUser - error', err);
		throw err;
	}
};

// Signs out from all devices, as an administrator.
const signUserOut = async (Username) => {
	const params = { UserPoolId, Username };
	console.log('signUserOut - params - ', params);
	try {
		const response = await cognitoIdentityServiceProvider.adminUserGlobalSignOut(params).promise();
		console.log('signUserOut - success - ', response);
		return response;
	} catch (err) {
		console.log('signUserOut - err - ', err);
		throw err;
	}
};

const getAccount = async (username) => {
	const params = {
		UserPoolId: UserPoolId,
		Filter: `name = "${username}"`,
		Limit: 1,
	};
	console.log('getAccount - params - ', params);
	let response;
	try {
		response = await cognitoIdentityServiceProvider.listUsers(params).promise();
	} catch (err) {
		console.log('getAccount - error - ', err);
	}

	if (!response?.Users?.length && response?.PaginationToken) {
		let nextToken = response.PaginationToken;
		while (nextToken) {
			params.PaginationToken = nextToken;
			try {
				response = await cognitoIdentityServiceProvider.listUsers(params).promise();
			} catch (err) {
				nextToken = null;
			}
			if (response?.Users.length) {
				nextToken = null;
			} else {
				nextToken = response?.PaginationToken;
			}
		}
	}

	console.log('getAccount - found accounts - ', response);
	if (!response?.Users?.length) {
		throw new Error('Account not found');
	}

	const account = response.Users.pop();
	account.attributes = getUserAttributes(account);

	console.log('getAccount - success - ', account);
	return account;
};

module.exports = {
	findUser,
	getUser,
	getUserByToken,
	getUsersInGroup,
	getAllUsersInGroup,
	getUserAttributes,
	getUserAttribute,
	addUserToGroup,
	removeUserFromGroup,
	confirmUserSignUp,
	disableUser,
	enableUser,
	listUsers,
	listAllUsers,
	listGroups,
	listGroupsForUser,
	listUsersInGroup,
	createGroup,
	createUser,
	UpdateUser,
	signUserOut,
	getAccount,
};
