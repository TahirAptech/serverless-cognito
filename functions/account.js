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
                Value: "false"
            },
            {
                Name: 'custom:dealerId',
                Value: "52790fa1-e0b3-4a03-9393-c62507f32f3a"
            }
        ]
    }).promise();

    console.log("USER :", User)

    return {
        statusCode: 200
    }
}