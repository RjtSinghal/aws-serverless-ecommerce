const { S3, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

const s3Client = new S3({ region: "ap-south-1" });
const dynamoDbClient = new DynamoDBClient({ region: "ap-south-1" });

exports.getUploadUrl = async (event) => {
  try {
    const bucketName = process.env.BUCKET_NAME;

    const { fileName, fileType, categoryName } = JSON.parse(event.body);
    if (!fileName || !fileType || !categoryName) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          msg: "fileName, fileType, and categoryName are required",
        }),
      };
    }

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      ContentType: fileType,
    });
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    //save category details in DynamoDB
    const putItemCommand = new PutItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        fileName: { S: fileName },
        categoryName: { S: categoryName },
        createdAt: { S: new Date().toISOString() },
      },
    });
    await dynamoDbClient.send(putItemCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl: signedUrl }),
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
