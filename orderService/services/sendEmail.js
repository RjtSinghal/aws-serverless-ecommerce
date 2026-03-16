const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const sesClient = new SESClient({ region: "ap-south-1" });

exports.SendOrderEmail = async (toEmail, orderId, productName) => {
  const emailParams = {
    Source: "singhal.rajat.1995@gmail.com",
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Subject: {
        Data: "Your Order Confirmation",
      },
      Body: {
        Text: {
          Data: `Thank you for your order\n\nOrder ID: ${orderId}\nProduct: ${productName}`,
        },
      },
    },
  };
  try {
    await sesClient.send(new SendEmailCommand(emailParams));
  } catch (error) {
    throw new Error(error.message || "Error Unknown");
  }
};
