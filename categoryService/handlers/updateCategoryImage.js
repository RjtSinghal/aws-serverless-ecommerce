const {
  DynamoDBClient,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");

const dynamoDbClient = new DynamoDBClient({ region: "ap-south-1" });

exports.updateCategoryImage = async (event) => {
  try {
    const tableName = process.env.DYNAMODB_TABLE;
    const record = event.Records[0];

    //get the s3 bucket name from the record
    const bucketName = record.s3.bucket.name;
    const fileName = record.s3.object.key;

    const imageUrl = `https://${bucketName}.s3.amazonaws.com/${fileName}`;

    const updateItemCommand = new UpdateItemCommand({
      TableName: tableName,
      Key: {
        fileName: { S: fileName },
      },
      UpdateExpression: "SET imageUrl = :imageUrl",
      ExpressionAttributeValues: {
        ":imageUrl": { S: imageUrl },
      },
    });
    await dynamoDbClient.send(updateItemCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({ msg: "Category image updated successfully" }),
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
