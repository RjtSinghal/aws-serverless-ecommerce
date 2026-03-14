const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const crypto = require("crypto");

const s3Client = new S3Client({ region: "ap-south-1" });
const dynamoDBClient = new DynamoDBClient({ region: "ap-south-1" });

exports.getUploadUrl = async (event) => {
  try {
    const bucketName = process.env.BUCKET_NAME;
    const tableName = process.env.DYNAMODB_TABLE;

    const {
      fileName,
      fileType,
      productName,
      productPrice,
      description,
      quantity,
      category,
      email,
    } = JSON.parse(event.body);

    if (
      !fileName ||
      !fileType ||
      !productName ||
      !productPrice ||
      !description ||
      !category ||
      !email
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields" }),
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

    const productId = crypto.randomUUID();
    const putItemCommand = new PutItemCommand({
      TableName: tableName,
      Item: {
        id: { S: productId },
        fileName: { S: fileName },
        productName: { S: productName },
        productPrice: { N: productPrice.toString() },
        description: { S: description },
        quantity: { N: quantity.toString() },
        category: { S: category },
        email: { S: email },
        isApproved: { BOOL: false },
        createdAt: { S: new Date().toISOString() },
      },
    });
    await dynamoDBClient.send(putItemCommand);

    return {
      statusCode: 201,
      body: JSON.stringify({ uploadUrl: signedUrl }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to generate upload URL",
        error: error.message,
      }),
    };
  }
};
