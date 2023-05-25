const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

module.exports.handler = async (event, context) => {
    const params = {
      FunctionName: 'otherLambda',
      InvocationType: 'Event',
      Payload: JSON.stringify({
        name: "Tahir Mahmood Hashmi",
        designation: "Senior Backend Developer"
      })
    };
  
    await lambda.invoke(params).promise();
  
    // continue with the rest of your function logic
  };