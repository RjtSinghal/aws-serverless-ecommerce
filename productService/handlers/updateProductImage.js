const {
  DynamoDBClient,
  UpdateItemCommand,
  ScanCommand,
} = require("@aws-sdk/client-dynamodb");
const dynamoDBClient = new DynamoDBClient({ region: "ap-south-1" });

exports.updateProductImage = async (event) => {
  try {
    const tableName = process.env.DYNAMODB_TABLE;

    const record = event.Records[0];

    const bucketName = record.s3.bucket.name;

    const fileName = record.s3.object.key;

    const imageUrl = `https://${bucketName}.s3.amazonaws.com/${fileName}`;

    const scanCommand = new ScanCommand({
      TableName: tableName,
      FilterExpression: "fileName = : filename",
      ExpressionAttributeValues: {
        ":filename": { S: fileName },
      },
    });
    const scanResult = await dynamoDBClient.send(scanCommand);

    if (!scanResult.Items || scanResult.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Product not found" }),
      };
    }

    const productId = scanResult.Items[0].id.S;

    const updateItemCommand = new UpdateItemCommand({
      TableName: tableName,
      Key: { id: { S: productId } },
      UpdateExpression: "SET imageUrl = :imageUrl",
      ExpressionAttributeValues: {
        ":imageUrl": { S: imageUrl },
      },
    });
    await dynamoDBClient.send(updateItemCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Product image updated successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to update product image",
        error: error.message,
      }),
    };
  }
};
