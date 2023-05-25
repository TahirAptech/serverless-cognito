const { getEnvVar } = require('../../utils/env');
const { randomGenerator } = require('../../utils/generateRandom');
const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider({
	apiVersion: "2016-04-19",
	region: "us-east-1"
});

const createUserInCognito = async ({ accountId, email, firstName, lastName, dealerId }) => {
	// For STANDARD User
	const { User } = await cognito
		.adminCreateUser({
			UserPoolId: getEnvVar("UserPoolId"),
			Username: email,
			DesiredDeliveryMediums: ["EMAIL"],
			TemporaryPassword: "$A" + randomGenerator(8), // v4(),
			UserAttributes: [
				// TODO: store dealerId in custom attributes
				{
					Name: 'custom:isDealer',
					Value: "false"
				},
				{
					Name: 'custom:dealerId',
					Value: dealerId
				},
				{
					Name: 'custom:accountId',
					Value: accountId
				},

				{
					Name: 'custom:givenName',
					Value: firstName
				},
				{
					Name: 'custom:familyName',
					Value: lastName
				}
			],

		})
		.promise();

	if (!User) {
		throw new Error(' Unfortunately user does not created. ');
	}

	return { User };
};

module.exports = {
	createUserInCognito
}
