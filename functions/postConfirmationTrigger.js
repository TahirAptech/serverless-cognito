const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid');
const { getEnvVar } = require('../utils/env');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: "us-east-1"
});

module.exports.handler = async (event) => {
  console.log("EVENT :",event)

  const { userAttributes } = event.request;

  if (userAttributes["custom:isDealer"] == "true") {
    // creating dealer record
    const item = {
      pk: 'DEALER',
      sk: `${userAttributes.sub}`, //dealerId
      email: userAttributes.email
    };
    await dynamodb.put({ TableName: getEnvVar("USER_TABLE"), Item: item }).promise();
  }
  else if (userAttributes["custom:dealerId"] && userAttributes["custom:isDealer"] == "false") {
    // creating Dealers's ACCOUNT Record:
    const accountId = userAttributes.sub;
    const companyId = uuid()
    const item = {
      pk: 'ACCOUNT',
      sk: `${userAttributes["custom:dealerId"]}#ACCOUNT#${companyId}`,
      email: userAttributes.email
    };
    await dynamodb.put({ TableName: getEnvVar("ACCOUNT_TABLE"), Item: item }).promise();

    // For ADMIN User.
    item.pk = 'USER';
    item.sk = `${companyId}#user#${accountId}#role#ADMIN`; 
    await dynamodb.put({ TableName: getEnvVar("USER_TABLE"), Item: item }).promise();

    // TODO: update custom attribute accountId of this user in cognito
    const updateCognitoUser = await COGNITO_CLIENT.adminUpdateUserAttributes({
      UserPoolId: getEnvVar("UserPoolId"),
      Username: accountId,
      UserAttributes:[
        {
					Name: 'custom:accountId',
					Value: companyId
				}
      ]
    }).promise()
  }
  
  return event
};