const {
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const client = new CognitoIdentityProviderClient({ region: "ap-south-1" });

const CLIENT_ID = process.env.CLIENT_ID;

exports.confirmForgotPassword = async (event) => {
  const { email, code, newPassword } = JSON.parse(event.body);
  const params = {
    ClientId: CLIENT_ID,
    Username: email,
    ConfirmationCode: code,
    Password: newPassword,
  };
  try {
    const command = new ConfirmForgotPasswordCommand(params);
    await client.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({
        msg: "Password reset successful. You can now log in with your new password.",
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        msg: "Password reset confirmation failed.",
        error: error.message,
      }),
    };
  }
};
