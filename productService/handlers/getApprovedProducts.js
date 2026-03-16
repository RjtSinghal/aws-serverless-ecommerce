const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const dynamoDbClient = new DynamoDBClient({ region: "ap-south-1" });

exports.getApprovedProducts = async () => {
  try {
    const tableName = process.env.DYNAMODB_TABLE;

    const scanCommand = new ScanCommand({
      TableName: tableName,
      FilterExpression: "isApproved = :trueValue",
      ExpressionAttributeValues: {
        ":trueValue": { BOOL: true },
      },
    });
    const { Items } = await dynamoDbClient.send(scanCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({ products: Items }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to fetch approved products",
        error: error.message,
      }),
    };
  }
};
