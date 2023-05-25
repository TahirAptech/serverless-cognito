const AWS = require('aws-sdk');
const { getEnvVar } = require('../utils/env');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  console.log("EVENT :", event)
  const { userAttributes } = event.request;

  if (userAttributes["custom:isDealer"] == "false" && userAttributes["custom:accountId"]) {
    // For STANDARD User
    const userId = event.userName;
    const item = {
      pk: 'USER',
      sk: `${userAttributes["custom:accountId"]}#user#${userId}#role#STANDARD`,
      email: userAttributes.email,
      firstName: userAttributes["custom:firstName"],
      lastName: userAttributes["custom:lastName"]
    };
    await dynamodb.put({ TableName: getEnvVar("USER_TABLE"), Item: item }).promise();
  }
  return event
};