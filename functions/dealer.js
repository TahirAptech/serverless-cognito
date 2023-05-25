const AWS = require('aws-sdk');
const { getEnvVar } = require('../utils/env');
const COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
    apiVersion: "2016-04-19",
    region: "us-east-1"
});

module.exports.handler = async (event, context, callback) => {

    const { UserSub: User } = await COGNITO_CLIENT.signUp({
        ClientId: getEnvVar("ClientId"),
        Password: '$Admin#123',
        Username: '',
        UserAttributes: [
            {
                Name: 'custom:isDealer',
                Value: "true"
            }
        ]
    }).promise();

    console.log("USER :", User)

    const addToGroup = await COGNITO_CLIENT.adminAddUserToGroup({
        Username: User,
        UserPoolId: getEnvVar("UserPoolId"),
        GroupName: "dealer"
    }).promise()

    console.log("addToGroup: ", addToGroup)
    return {
        statusCode: 200
    }

}