const { S3, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3({ region: "ap-south-1" });

exports.getUploadUrl = async (event) => {
  try {
    const bucketName = process.env.BUCKET_NAME;

    const { fileName, fileType } = JSON.parse(event.body);
    if (!fileName || !fileType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ msg: "fileName and fileType are required" }),
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

    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl: signedUrl }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: "Internal server error" }),
    };
  }
};
