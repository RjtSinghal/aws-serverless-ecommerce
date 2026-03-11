const {
  DynamoDBClient,
  ScanCommand,
  DeleteItemCommand,
} = require("@aws-sdk/client-dynamodb");

const dynamoDbClient = new DynamoDBClient({ region: "ap-south-1" });

// cleanup function to delete records older than 1 hour and no category image uploaded
exports.cleanUpCategories = async (event) => {
  try {
    const tableName = process.env.DYNAMODB_TABLE;

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const scanCommand = new ScanCommand({
      TableName: tableName,
      FilterExpression:
        "createdAt < :oneHourAgo AND attribute_not_exists(imageUrl)",
      ExpressionAttributeValues: {
        ":oneHourAgo": { S: oneHourAgo },
      },
    });

    const { Items } = await dynamoDbClient.send(scanCommand);
    if (!Items || Items.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ msg: "No categories found to clean up" }),
      };
    }

    let deletedCount = 0;

    for (const item of Items) {
      const deleteItemCommand = new DeleteItemCommand({
        TableName: tableName,
        key: { fileName: { S: item.fileName.S } },
      });
      await dynamoDbClient.send(deleteItemCommand);
      deletedCount++;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        msg: `Successfully cleaned up ${deletedCount} categories`,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        msg: "Internal server error",
        error: error.message,
      }),
    };
  }
};
