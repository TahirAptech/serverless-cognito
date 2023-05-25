const AWS  = require('aws-sdk');
const { getEnvVar } = require('../../utils/env');
const cognito = new AWS.CognitoIdentityServiceProvider({
    apiVersion: "2016-04-19",
    region: "us-east-1"
});

 const getCognitoUser = (email) => {
	return new Promise(async (resolve) => {
		await cognito.adminGetUser(
			{
				UserPoolId: getEnvVar("UserPoolId"),
				Username: email,
			},
			(err, data) => {
				if (err) {
					console.log('USER DOES NOT EXIST IN COGNITO ', err.message);
					resolve({});
				} else {
					resolve(data);
				}
			},
		);
	});
};

module.exports = {
	getCognitoUser
}
