const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const axios = require("axios");
const crypto = require("crypto");

const dynamoDBClient = new DynamoDBClient({ region: "ap-south-1" });
const sqsClient = new SQSClient({ region: "ap-south-1" });

// Lambda function to place an order and store it in SQS queue for processing
exports.placeOrder = async (event) => {
  try {
    const { id, quantity, email } = JSON.parse(event.body);
    if (!id || !quantity || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing required fields: id, quantity, email",
        }),
      };
    }

    const productRespose = await axios.get(
      "https://7lg9uq78r0.execute-api.ap-south-1.amazonaws.com/approved-products",
    );
    const approvedProducts = productRespose.data.products || [];
    const product = approvedProducts.find((p) => p.id?.S === id);
    if (!product) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Product not found or not approved" }),
      };
    }

    const availableStock = parseInt(product.quantity?.N || "0");
    if (quantity > availableStock) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Insufficient stock",
        }),
      };
    }

    const orderId = crypto.randomUUID();
    const orderPayload = {
      id: orderId,
      productId: id,
      quantity,
      email: email,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
    // Send Order to SQS queue
    await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: process.env.SQS_QUEUE_URL,
        MessageBody: JSON.stringify(orderPayload),
      }),
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Order placed successfully", orderId }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to place order",
        error: error.message,
      }),
    };
  }
};
