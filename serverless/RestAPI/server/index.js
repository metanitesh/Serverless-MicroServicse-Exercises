const AWS = require('aws-sdk');
const uuid = require('uuid');

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("Post Request")

  const id = uuid.v4();
  const parseBody = JSON.parse(event.body);

  const newItem = {
    id,
    ...parseBody
  }

  await docClient.put({
    TableName: 'Courses',
    Item: newItem
  }).promise()

  return {
    statusCode: 201,
    headers : {
        "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      newItem
    }),
  }
}