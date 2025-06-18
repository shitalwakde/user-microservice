const AWS = require("aws-sdk");
require("dotenv").config();

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.DYNAMODB_TABLE;

module.exports = { dynamoDB, tableName };


async function getDbPassword() {
  if (process.env.NODE_ENV === 'prod') {
    const client = new AWS.SecretsManager();
    const secret = await client.getSecretValue({
      SecretId: 'prod/user-service/db-password'
    }).promise();
    return JSON.parse(secret.SecretString).password;
  }
  return process.env.DB_PASSWORD;
}
