const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

const dynamoDbClient = new DynamoDBClient({ region: "ap-south-1" });

exports.confirmUpload = async (event) => {
  try {
    const tableName = process.env.DYNAMODB_TABLE;
    const bucketName = process.env.BUCKET_NAME;

    const record = event.Records[0];
    const fileName = record.s3.object.key;

    const imageUrl = `https://${bucketName}.s3.amazonaws.com/${fileName}`;

    const putItemCommand = new PutItemCommand({
      TableName: tableName,
      Item: {
        fileName: { S: fileName },
        imageUrl: { S: imageUrl },
        uploadedAt: { S: new Date().toISOString() },
      },
    });
    await dynamoDbClient.send(putItemCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({ msg: "File uploaded and confirmed" }),
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
