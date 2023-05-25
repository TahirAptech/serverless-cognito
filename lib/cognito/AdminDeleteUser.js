
const { getEnvVar } = require('../../utils/env');

const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider({
    apiVersion: "2016-04-19",
    region: "us-east-1"
});

export const deleteUserInCognito = async (email) => {

    return await cognito.adminDeleteUser({
        UserPoolId: getEnvVar("UserPoolId"),
        Username: email
    }).promise()
}
