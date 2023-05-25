const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const jwt = require('jsonwebtoken');
const { getCognitoUser } = require('../lib/cognito/AdminGetUser');
const { getEnvVar } = require('../utils/env');

// Generate policy to allow this user on this API:
const generatePolicy = (userId, dealerId, effect, resource) => {
    const authResponse = {};
    authResponse.userId = userId;
    authResponse.dealerId = dealerId
    if (effect && resource) {
        const policyDocument = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        const statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
};

module.exports.authorizer = async (event, context, callback) => {
    console.log('Auth function invoked', event);
    try {
        const token = event.authorizationToken.split(' ')[1];
        const decoded = jwt.decode(token);
        console.log(decoded);
        const userId = decoded.sub;
        // { 
        //   "sub": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        // }
        const user = await getCognitoUser(userId)

        const accountIdObject = user.UserAttributes.find(
            attribute => attribute.Name === 'custom:accountId'
        );
        const dealerIdObject = user.UserAttributes.find(
            attribute => attribute.Name === 'custom:dealerId'
        );

        const { Item: userObj } = await dynamodb.get({
            TableName: getEnvVar("USER_TABLE"),
            Key: {
                pk: "USER",
                sk: `${accountIdObject.Value}#user#${userId}#role#ADMIN`
            },

        }).promise()
        console.log("ITEM", userObj);

        if (!userObj) {
            callback('Unauthorized');
        }

        callback(null, generatePolicy(userId, dealerIdObject.Value, 'Allow', event.methodArn));

    } catch (err) {
        console.error(err);
        callback('Unauthorized');
    }
};


