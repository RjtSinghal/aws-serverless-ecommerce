const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const dynamoDBClient = new DynamoDBClient({ region: "ap-south-1" });

// Lambda function to process orders from SQS queue and update DynamoDB table
exports.processOrder = async (event) => {
  try {
    // loop through each record in the SQS event
    for (const record of event.Records) {
      const orderData = JSON.parse(record.body);

      const { id, productId, quantity, email, status, createdAt } = orderData;

      // Store order in DynamoDB
      const putItemCommand = new PutItemCommand({
        TableName: process.env.ORDERS_TABLE,
        Item: {
          id: { S: id },
          productId: { S: productId },
          quantity: { N: quantity.toString() },
          email: { S: email },
          status: { S: status },
          createdAt: { S: createdAt },
        },
      });
      await dynamoDBClient.send(putItemCommand);
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Orders processed successfully" }),
    };
  } catch (error) {
    console.error("Error processing order:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to process order",
        error: error.message,
      }),
    };
  }
};
